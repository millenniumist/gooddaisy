import prisma from "@/config/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { Client } from '@line/bot-sdk'

// const lineClient = new Client({
//   channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
// });

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Webhook payload:", body);
        console.log("body.events:", body.events);
        console.log("body.events.length:", body.events?.length);

        if (body.events && body.events.length === 0) {
            console.log("Verification condition matched - returning 200");
            return NextResponse.json({ success: true }, { status: 200 });
        }
        console.log("Code reached after verification check");


          // Check if this is a user profile request
          if (!body.userProfile) {
            return NextResponse.json({ 
                success: true, 
                message: "Received non-user profile event" 
            }, { status: 200 });
        }

        // Rest of the code for handling actual webhook events
        const userId = body.userProfile.userId
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                error: "No user ID provided" 
            }, { status: 400 });
        }

        // // Get user profile directly from LINE
        // const userProfile = await lineClient.getProfile(userId);

        let user = await prisma.user.findUnique({
            where: { userId: body.userProfile.userId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    userId: body.userProfile.userId,
                    displayName: body.userProfile.displayName,
                    pictureUrl: body.userProfile.pictureUrl,
                    statusMessage: body.userProfile.statusMessage,
                    isAdmin: false,
                    createdDate: new Date(),
                }
            });
        } else {
            user = await prisma.user.update({
                where: { userId: body.userProfile.userId },
                data: {
                    displayName: body.userProfile.displayName,
                    pictureUrl: body.userProfile.pictureUrl,
                    statusMessage: body.userProfile.statusMessage,
                }
            });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        const cookieStore = await cookies();
        cookieStore.set("token", token, { 
            httpOnly: true, 
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
        });

        cookieStore.set("userId", user.id.toString(), { 
            httpOnly: true, 
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60
        });

        // Add cache control headers
        const headers = {
            'Cache-Control': 'no-store',
            'Content-Type': 'application/json',
        };
        const userResponse = {
            id: user.id,
            userId: user.userId,
            displayName: user.displayName,
            pictureUrl: user.pictureUrl,
            statusMessage: user.statusMessage,
            isAdmin: user.isAdmin,
            createdDate: user.createdDate
        };
        console.log("CookieStore:", cookieStore.get("token"));
        return NextResponse.json({ 
            success: true, 
            user: userResponse, 
            token 
        }, { 
            status: 200,
            headers
        });

    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Error processing webhook" 
        }, { status: 500 });
    }
}

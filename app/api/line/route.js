import prisma from "@/config/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { Client } from '@line/bot-sdk'

const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Webhook payload:", body);

        // Handle webhook verification
        if (body.events && body.events.length === 0) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // Rest of the code for handling actual webhook events
        const userId = body.events[0].source.userId;
        
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                error: "No user ID provided" 
            }, { status: 400 });
        }

        // Get user profile directly from LINE
        const userProfile = await lineClient.getProfile(userId);

        let user = await prisma.user.findUnique({
            where: { userId: userProfile.userId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    userId: userProfile.userId,
                    displayName: userProfile.displayName,
                    pictureUrl: userProfile.pictureUrl,
                    statusMessage: userProfile.statusMessage,
                    isAdmin: false,
                    createdDate: new Date(),
                }
            });
        } else {
            user = await prisma.user.update({
                where: { userId: userProfile.userId },
                data: {
                    displayName: userProfile.displayName,
                    pictureUrl: userProfile.pictureUrl,
                    statusMessage: userProfile.statusMessage,
                }
            });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        const cookieStore = await cookies();
        await cookieStore.set("token", token, { httpOnly: true, sameSite: "strict" });
        await cookieStore.set("userId", user.id.toString(), { httpOnly: true, sameSite: "strict" });

        const userResponse = {
            id: user.id,
            userId: user.userId,
            displayName: user.displayName,
            pictureUrl: user.pictureUrl,
            statusMessage: user.statusMessage,
            isAdmin: user.isAdmin,
            createdDate: user.createdDate
        };

        return NextResponse.json({ 
            success: true, 
            user: userResponse, 
            token 
        }, { status: 200 });

    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Error processing webhook" 
        }, { status: 500 });
    }
}

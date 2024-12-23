import prisma from "@/config/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Webhook payload:", body);

        // Handle LINE webhook verification
        if (!body || !body.events || body.events.length === 0) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // Handle user authentication
        if (body.userProfile) {
            const { userId, displayName, pictureUrl, statusMessage } = body.userProfile;
            
            if (!userId) {
                return NextResponse.json({ success: true }, { status: 200 });
            }

            let user = await prisma.user.findUnique({
                where: { userId }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        userId,
                        displayName,
                        pictureUrl,
                        statusMessage,
                        isAdmin: false,
                        createdDate: new Date(),
                    }
                });
            } else {
                user = await prisma.user.update({
                    where: { userId },
                    data: {
                        displayName,
                        pictureUrl,
                        statusMessage,
                    }
                });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

            const cookieStore = cookies();
            cookieStore.set("token", token, { 
                httpOnly: true, 
                sameSite: "strict",
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60
            });

            cookieStore.set("userId", user.id.toString(), { 
                httpOnly: true, 
                sameSite: "strict",
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60
            });

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

            return NextResponse.json({ 
                success: true, 
                user: userResponse, 
                token 
            }, { 
                status: 200,
                headers
            });
        }

        // Default response for other cases
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ success: true }, { status: 200 });
    }
}

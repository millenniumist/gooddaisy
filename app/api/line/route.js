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
        // Try webhook first
        if (body.events || body.destination) {
            console.log("Webhook payload:", body);
            
            if (body.destination && body.events.length === 0) {
                console.log("Webhook verification request received");
                return NextResponse.json({ success: true }, { status: 200 });
            }
        }

        // If no webhook data, try LINE Login profile
        let userProfile;
        if (!body.userProfile) {
            // Get access token from request header or body
            const accessToken = request.headers.get('authorization')?.split(' ')[1] || body.accessToken;
            
            if (!accessToken) {
                return NextResponse.json({
                    success: false,
                    message: "LINE Login required",
                    loginUrl: `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CHANNEL_ID}&redirect_uri=${process.env.LINE_REDIRECT_URI}&state=12345&scope=profile`
                }, { status: 401 });
            }

            // Get profile using access token
            userProfile = await fetch('https://api.line.me/v2/profile', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => res.json());
        } else {
            userProfile = body.userProfile;
        }

        // Process user data
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

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
        return NextResponse.json({ 
            success: false, 
            message: "Authorization code required" 
        }, { status: 400 });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.LINE_REDIRECT_URI,
                client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
                client_secret: process.env.LINE_CHANNEL_SECRET
            })
        }).then(res => res.json());

        // Redirect to your frontend with the access token
        return NextResponse.redirect(new URL(`/?token=${tokenResponse.access_token}`, request.url));
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: "Error processing authorization code" 
        }, { status: 500 });
    }
}

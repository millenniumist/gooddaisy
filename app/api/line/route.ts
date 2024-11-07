import prisma from "@/config/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        //console.log(process.env.USER_DEFAULT_PASSWORD)
        const { userProfile, userDefaultPassword } = await request.json();
        

        // Find user in the database
        let user = await prisma.user.findUnique({
            where: {
                userId: userProfile.userId
            }
        });

        if (user) {
            // Existing user validation
            if (user.password !== process.env.USER_DEFAULT_PASSWORD) {
                return NextResponse.json({ success: false, error: "Invalid User" }, { status: 401 });
            }

            // Update user information
            user = await prisma.user.update({
                where: { userId: userProfile.userId },
                data: {
                    displayName: userProfile.displayName,
                    pictureUrl: userProfile.pictureUrl,
                    statusMessage: userProfile.statusMessage,
                }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    userId: userProfile.userId,
                    displayName: userProfile.displayName,
                    pictureUrl: userProfile.pictureUrl,
                    statusMessage: userProfile.statusMessage,
                    password: process.env.USER_DEFAULT_PASSWORD,
                    isAdmin: false,
                    createdDate: new Date(),
                }
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "30d" });

        // Set cookies
        const cookieStore = await cookies();
        await cookieStore.set("token", token, { httpOnly: true, sameSite: "strict" });
        await cookieStore.set("userId", user.id.toString(), { httpOnly: true, sameSite: "strict" });

        // Prepare user response
        const userResponse = {
            id: user.id,
            userId: user.userId,
            displayName: user.displayName,
            pictureUrl: user.pictureUrl,
            statusMessage: user.statusMessage,
            isAdmin: user.isAdmin,
            createdDate: user.createdDate
        };

        return NextResponse.json({ success: true, user: userResponse, token }, { status: 200 });

    } catch (error) {
        console.error("Error in LINE authentication:", error);
        return NextResponse.json({ success: false, error: "An error occurred during authentication" }, { status: 500 });
    }
}

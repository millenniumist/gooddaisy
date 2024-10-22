import prisma from "@/config/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        console.log(process.env.USER_DEFAULT_PASSWORD)
        const { userProfile, userDefaultPassword } = await request.json()
        if (userDefaultPassword !== process.env.USER_DEFAULT_PASSWORD) {
            console.log("front-back not match")
            return NextResponse.json({
                success: false,
                message: "front-back not match"
            })
        }
        let user = await prisma.user.findUnique({
            where: {
                userId: userProfile.userId
            }
        })

        if (user) {
            // EXISTING USER
            // console.log("existing user")

            //Make sure Current user is from our backend by env.
            if (user.password !== process.env.USER_DEFAULT_PASSWORD) {
                return NextResponse.json({ success: false, error: "Invalid User" }, { status: 401 })

            } else {
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "30d" })
                cookies().set("token", token, { httpOnly: true, sameSite: "strict" })
                cookies().set("userId", user.id.toString(), { httpOnly: true, sameSite: "strict" })
                user = await prisma.user.update({
                    where: { userId: userProfile.userId },
                    data: {
                        displayName: userProfile.displayName,
                        pictureUrl: userProfile.pictureUrl,
                        statusMessage: userProfile.statusMessage,
                    }
                })
                return NextResponse.json({ success: true, user, token }, { status: 200 })
            }
        } else {
            // NEW USER
            user = await prisma.user.create({
                data: {
                    userId: userProfile.userId,
                    displayName: userProfile.displayName,
                    pictureUrl: userProfile.pictureUrl,
                    statusMessage: userProfile.statusMessage,
                    isAdmin: false,
                    createdDate: new Date(),
                }
            })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "30d" })
        cookies().set("token", token, { httpOnly: true, sameSite: "strict" })
        cookies().set("userId", user.id.toString(), { httpOnly: true, sameSite: "strict" })

        const userResponse = {
            id: user.id,
            userId: user.userId,
            displayName: user.displayName,
            pictureUrl: user.pictureUrl,
            statusMessage: user.statusMessage,
            isAdmin: user.isAdmin,
            createdDate: user.createdDate
        };

        return NextResponse.json({ success: true, user: userResponse, token }, { status: 200 })

    } catch (error) {
        console.error("Error in LINE authentication:", error)
        return NextResponse.json({ success: false, error: "An error occurred during authentication" }, { status: 500 })
    }
}

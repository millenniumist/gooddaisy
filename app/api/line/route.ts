import prisma from "@/config/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        const {userProfile} = await request.json()
        const user = await prisma.user.upsert({
            where: { userId: userProfile.userId },
            update: {
                displayName: userProfile.displayName,
                pictureUrl: userProfile.pictureUrl,
                statusMessage: userProfile.statusMessage
            },
            create: {
                userId: userProfile.userId,
                displayName: userProfile.displayName,
                pictureUrl: userProfile.pictureUrl,
                statusMessage: userProfile.statusMessage,
                password: process.env.USER_DEFAULT_PASSWORD,
            }
        })
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "30d" })
        console.log(user,token)
        cookies().set("token", token, { httpOnly: true, sameSite: "strict" })
        cookies().set("userId", user.id.toString(), { httpOnly: true, sameSite: "strict" })
        return NextResponse.json({ success: true, user,token }, { status: 200 })

    } catch (error) {
        console.log(error)
    }
}
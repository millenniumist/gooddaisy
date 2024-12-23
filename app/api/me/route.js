import prisma from "@/config/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return NextResponse.json({ 
                success: false, 
                error: "No token provided" 
            }, { status: 401 })
        }

        const decoded = jwt.verify(token.value, process.env.JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                userId: true,
                displayName: true,
                pictureUrl: true,
                statusMessage: true,
                isAdmin: true
            }
        })

        if (!user) {
            return NextResponse.json({ 
                success: false, 
                error: "User not found" 
            }, { status: 404 })
        }

        return NextResponse.json({ 
            success: true, 
            user 
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 })
    }
}

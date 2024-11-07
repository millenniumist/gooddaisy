import { NextResponse } from "next/server";
import prisma from "@/config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const appSecret = request.headers.get('X-App-Secret');
        const appOrigin = request.headers.get('X-App-Origin');
        console.log("Login headers:",appSecret, appOrigin)
        if (appSecret !== process.env.USER_DEFAULT_PASSWORD || appOrigin !== 'admin-frontend') {
            return NextResponse.json({ error: "Unauthorized request origin" }, { status: 403 });
        }
        const { username, password } = await request.json();
        //console.log("received front pass:",userDefaultPassword)
        const user = await prisma.user.findUnique({
            where: {
                userId: username
            }
        });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || '',
            { expiresIn: '30d' }
        );
        const cookieStore = await cookies();
        cookieStore.set("token", token, { httpOnly: true, sameSite: "strict" });
        cookieStore.set("userId", user.id.toString(), { httpOnly: true, sameSite: "strict" });


        const newUser = {
            id: user.id,
            userId: user.userId,
            displayName: user.displayName,
        };
        return NextResponse.json({ newUser, token });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
    }
}
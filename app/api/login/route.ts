import { NextResponse } from "next/server";
import prisma from "@/config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
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
        cookies().set("token", token, { httpOnly: true, sameSite: "strict" })
        cookies().set("userId", user.id.toString(), { httpOnly: true, sameSite: "strict" })


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
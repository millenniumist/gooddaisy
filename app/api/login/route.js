import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/config/prisma';

export async function POST(request) {
    try {
        const body = await request.json();

        const { username, password } = body;
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

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || '',
            { expiresIn: '30d' }
        );

        const response = NextResponse.json({
            newUser: {
                id: user.id,
                userId: user.userId,
                displayName: user.displayName,
            },
            token
        });

        response.cookies.set('token', token, { 
            httpOnly: true, 
            sameSite: 'strict'
        });
        
        response.cookies.set('userId', user.id.toString(), { 
            httpOnly: true, 
            sameSite: 'strict'
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
    }
}

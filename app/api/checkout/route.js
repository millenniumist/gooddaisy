import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: "User ID not found in cookie" }, { status: 401 });
        }

        const totalPrice = await prisma.order.findFirst({
            where: {
                userId: Number(userId),
                paymentStatus: 'UNPAID'
            },
            orderBy: {
                id: 'desc'
            },
            select: {
                totalPrice: true
            }
        });
        return NextResponse.json(totalPrice);
    } catch (error) {
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: "User ID not found in cookie" }, { status: 401 });
        }

        const order = await prisma.order.findFirst({
            where: {
                userId: Number(userId),
                paymentStatus: "UNPAID"
            },
            select: {
                id: true,
            } 
        });
        
        if (!order) {
            return NextResponse.json({ error: "No cart found" }, { status: 404 });
        }

        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                paymentStatus: "PENDING",
                orderItems: {
                    updateMany: {
                        where: {
                            orderId: order.id
                        },
                        data: {
                            status: "PENDING"
                        }
                    }
                }
            }
        })
   
        return NextResponse.json({message:`Updated orderId ${order.id}`});
    } catch (error) {
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}

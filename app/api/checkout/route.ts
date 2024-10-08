import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';

export async function GET(request: Request) {
    try {
        const totalPrice = await prisma.order.findFirst(
            {
                where: {
                    productionStatus: "CART"
                },
                orderBy: {
                    id: 'desc'
                }
            }
        )
        return NextResponse.json(totalPrice)
    } catch (error) {
        console.log(error)
    }
}

export async function POST(request: Request) {
    try {
        const orderId = await prisma.order.findFirst(
            {
                where: {
                    productionStatus: "CART"
                },
                select: {
                    id: true,
                } 
            }
        )
        await prisma.order.update({
            where: {
                id: orderId?.id
            },
            data: {
                productionStatus: "PENDING"
            }
        })
        return NextResponse.json({message:`updated orderId ${orderId?.id}`})
    } catch (error) {
        console.log(error)
    }
}

import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, {params}: {params: {id: string}}) {
    try {
      const id = Number(params.id);
      console.log(id)
      const deleteItem = await prisma.orderItem.delete({ where: { id: id } });
      return NextResponse.json({ deleteItem }, { status: 200 });
    } catch (error) {
      console.error('Failed to delete order:', error);
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
  }
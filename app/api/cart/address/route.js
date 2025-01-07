import { NextResponse } from "next/server";
import prisma from "@/config/prisma";
import { cookies } from "next/headers";

export async function GET() {
  const userId = (await cookies()).get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { address: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ address: user.address });
  } catch (error) {
    console.error("Failed to fetch address:", error);
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}

export async function POST(request) {
  const userId = (await cookies()).get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const { address } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { address },
    });

    return NextResponse.json({ address: updatedUser.address });
  } catch (error) {
    console.error("Failed to update address:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

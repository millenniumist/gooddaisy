import { cookies } from "next/headers";
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token"); // Move this line up
      
      if (!token) {
        return NextResponse.json({ success: false }, { status: 401 });
      }
  
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
  
      if (!user) {
        return NextResponse.json({ success: false }, { status: 404 });
      }
      console.log("user:",user)
      return NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          userId: user.userId,
          displayName: user.displayName,
          pictureUrl: user.pictureUrl,
          statusMessage: user.statusMessage,
          isAdmin: user.isAdmin,
          createdDate: user.createdDate
        }
      });
    } catch (error) {
      return NextResponse.json({ success: false }, { status: 500 });
    }
  }
  
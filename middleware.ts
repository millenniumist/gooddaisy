import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
     const token = request.cookies.get('token')?.value || ''
    //  console.log(token)
    if (!token) {
        // console.log("no token")
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string | undefined)
        const { payload } = await jose.jwtVerify(token, secret)
        // const userId = payload.userId as string

        // Create a response and set the userId cookie
        const response = NextResponse.next()
        
        return response
    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/', '/product/:path*', '/cart/:path*', '/checkout','/add-product','/del-product','/print'],
}

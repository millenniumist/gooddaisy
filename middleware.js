import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request) {
     const token = request.cookies.get('token')?.value || ''
    
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)

        const response = NextResponse.next()
        
        return response
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/checkout','/add-product','/del-product','/print','/orders'],
}

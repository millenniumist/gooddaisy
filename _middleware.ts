import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest, response: NextResponse) {
    const token = request.cookies.get('token')?.value || ''
    if(!token){
  return NextResponse.redirect(new URL('/login', request.url))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/product/:path*',
}
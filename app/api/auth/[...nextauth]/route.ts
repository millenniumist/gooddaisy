import { NextResponse } from 'next/server'
import { NextApiRequest } from 'next'
import axios from 'axios'
import prisma from '@/config/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextApiRequest) {
    const { searchParams } = new URL(request.url as string)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    // Verify the state to prevent CSRF attacks
    // const cookieStore = cookies()
    // const storedState = cookieStore.get('line_auth_state')
    // console.log(storedState)

    // if (!storedState || state !== storedState.value) {
    //     return NextResponse.json({ success: false, message: 'Invalid state' }, { status: 400 })
    // }

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI,
            client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
            client_secret: process.env.LINE_CHANNEL_SECRET
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const accessToken = tokenResponse.data.access_token
        // Use the access token to fetch user profile
        const profileResponse = await axios.get('https://api.line.me/v2/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const userProfile = profileResponse.data

        // Store user in database
        const user = await prisma.user.upsert({
            where: { userId: userProfile.userId },
            update: {
                displayName: userProfile.displayName,
                pictureUrl: userProfile.pictureUrl,
                statusMessage: userProfile.statusMessage
            },
            create: {
                userId: userProfile.userId,
                displayName: userProfile.displayName,
                pictureUrl: userProfile.pictureUrl,
                statusMessage: userProfile.statusMessage
            }
        })

        // Clear the state cookie after successful authentication
        // cookieStore.delete('line_auth_state')

        // Redirect to home page after successful authentication
        return NextResponse.redirect(new URL(process.env.LINE_REDIRECT_URI as string))
    } catch (error) {
        console.error('Error during LINE authentication:', error)
        return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 500 })
    }
}

export async function POST(request: NextApiRequest) {
    try {
        const { state,
            channelId,
            loginUrl } = await request.json()
        console.log(request)
    } catch (error) {
        console.log(error)

    }
}
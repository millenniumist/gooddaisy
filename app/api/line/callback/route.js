export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.LINE_REDIRECT_URI,
            client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
            client_secret: process.env.LINE_CHANNEL_SECRET,
        })
    }).then(res => res.json())

    // Get user profile immediately after token exchange
    const { access_token } = tokenResponse
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then(res => res.json())

    // Redirect with both token and profile
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}?token=${access_token}&profile=${encodeURIComponent(JSON.stringify(profileResponse))}`)
}

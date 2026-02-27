import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const userAgent = request.headers.get('user-agent') || '';

    // Check if it's a Google crawler (e.g. Mediapartners-Google, Googlebot)
    if (!userAgent.toLowerCase().includes('google')) {
        return new NextResponse('Forbidden: Access Restricted', { status: 403 });
    }

    // The ads.txt content
    const adsTxtContent = 'google.com, pub-4468459107811853, DIRECT, f08c47fec0942fa0';

    return new NextResponse(adsTxtContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}

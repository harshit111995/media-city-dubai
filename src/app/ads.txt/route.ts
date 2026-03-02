import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // The ads.txt content
    const adsTxtContent = 'google.com, pub-4468459107811853, DIRECT, f08c47fec0942fa0';

    return new NextResponse(adsTxtContent, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}

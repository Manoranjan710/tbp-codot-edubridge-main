import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: 'Sign out successful'
        });

        // Clear the agent auth cookie
        response.cookies.set('agent-auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0
        });

        return response;

    } catch (error) {
        console.error('Agent sign out error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

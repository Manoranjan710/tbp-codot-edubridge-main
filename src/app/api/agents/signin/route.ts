import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface SignInRequest {
    email: string;
    password: string;
}

// Dummy password for all agents (temporary solution)
const DUMMY_PASSWORD = 'agent123';

export async function POST(request: NextRequest) {
    try {
        const body: SignInRequest = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find agent by email
        const agent = await prisma.agent.findUnique({
            where: {
                email: email.toLowerCase()
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                country: true,
                status: true
            }
        });

        if (!agent) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if agent is active
        if (agent.status !== 'active') {
            return NextResponse.json(
                { success: false, message: 'Your account is not active. Please contact support.' },
                { status: 403 }
            );
        }

        // Check dummy password
        if (password !== DUMMY_PASSWORD) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                agentId: agent.id,
                email: agent.email,
                role: 'agent'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Sign in successful',
            agent: {
                id: agent.id,
                email: agent.email,
                firstName: agent.first_name,
                lastName: agent.last_name,
                country: agent.country,
                status: agent.status
            }
        });

        // Set HTTP-only cookie
        response.cookies.set('agent-auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Agent sign in error:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                ...(process.env.NODE_ENV === 'development' && {
                    error: error instanceof Error ? error.message : 'Unknown error'
                })
            },
            { status: 500 }
        );
    }
}

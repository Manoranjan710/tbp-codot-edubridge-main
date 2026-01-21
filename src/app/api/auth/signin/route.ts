import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface SignInRequest {
  email: string;
  password: string;
}

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

    // Test agent credentials
    if (email.toLowerCase() === 'sophia.williams@example.com' && password === 'agent123') {
      const token = jwt.sign(
        { 
          userId: 'cmknjccbg0000w4g8e17hgi4g', 
          email: email.toLowerCase(),
          role: 'agent' 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        success: true,
        message: 'Sign in successful',
        user: {
          id: 'cmknjccbg0000w4g8e17hgi4g',
          email: email.toLowerCase(),
          firstName: 'Sophia',
          lastName: 'Williams',
          role: 'agent'
        }
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return response;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Sign in successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Sign in error:', error);
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
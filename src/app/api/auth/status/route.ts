import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Authentication system status',
      data: {
        database: 'connected',
        userCount,
        environment: process.env.NODE_ENV,
        jwtSecretExists: !!process.env.JWT_SECRET,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'System check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
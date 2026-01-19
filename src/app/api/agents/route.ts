import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const whereClause = status ? { status } : {};
    
    const agents = await prisma.agent.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: agents,
      count: agents.length
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Agent ID and status are required' },
        { status: 400 }
      );
    }
    
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedAgent,
      message: `Agent status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating agent status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update agent status' },
      { status: 500 }
    );
  }
}
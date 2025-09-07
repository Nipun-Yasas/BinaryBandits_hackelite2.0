import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '../../lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    return NextResponse.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

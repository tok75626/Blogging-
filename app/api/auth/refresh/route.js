import { NextResponse } from 'next/server';

// No-op refresh - tokens are long-lived (7 days), no rotation needed
export async function POST() {
  return NextResponse.json({ message: 'ok' });
}

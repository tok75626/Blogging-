import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(authHeader.split(' ')[1]);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    if (!filename) {
      return NextResponse.json({ message: 'Filename is required' }, { status: 400 });
    }

    const blob = await put(filename, request.body, { access: 'public' });
    return NextResponse.json(blob);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

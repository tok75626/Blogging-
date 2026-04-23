import { NextResponse } from 'next/server';
import AIService from '@/services/aiService';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(authHeader.split(' ')[1]);
    if (!user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    const { prompt } = await request.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const aiData = await AIService.generateBlogData(prompt);
    return NextResponse.json(aiData);

  } catch (error) {
    console.error('AI generate error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

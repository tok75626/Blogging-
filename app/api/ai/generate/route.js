import { NextResponse } from 'next/server';
import AIService from '@/services/aiService';
import { verifyAccessToken } from '@/lib/auth';

const getAuthUser = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return verifyAccessToken(token);
};

export async function POST(request) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const aiData = await AIService.generateBlogData(prompt);
    return NextResponse.json(aiData);

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

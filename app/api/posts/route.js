import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';

const getAuthUser = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.split(' ')[1]);
};

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(50, parseInt(searchParams.get('limit')) || 10);
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');

    let query = { published: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }
    if (tag) query.tags = tag;
    if (category) query.category = category;

    const [posts, total] = await Promise.all([
      Post.find(query).populate('author', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(query),
    ]);

    return NextResponse.json({
      posts,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });

  } catch (error) {
    console.error('GET /posts error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const user = getAuthUser(request);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { title, content, summary, tags, category, coverImage } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    const post = await Post.create({
      title: title.trim(),
      content,
      summary: summary || '',
      tags: Array.isArray(tags) ? tags : [],
      category: category || 'General',
      coverImage: coverImage || '',
      author: user.id,
      published: true,
    });

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.error('POST /posts error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

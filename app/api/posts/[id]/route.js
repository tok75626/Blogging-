import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import { verifyToken } from '@/lib/auth';

const getAuthUser = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.split(' ')[1]);
};

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const post = await Post.findById(params.id).populate('author', 'name').lean();
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /posts/[id] error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const user = getAuthUser(request);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    if (post.author.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { title, content, summary, tags, category, coverImage } = await request.json();
    post.title = title || post.title;
    post.content = content || post.content;
    post.summary = summary ?? post.summary;
    post.tags = Array.isArray(tags) ? tags : post.tags;
    post.category = category || post.category;
    post.coverImage = coverImage ?? post.coverImage;

    await post.save();
    return NextResponse.json(post);

  } catch (error) {
    console.error('PUT /posts/[id] error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const user = getAuthUser(request);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    if (post.author.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await post.deleteOne();
    return NextResponse.json({ message: 'Post deleted' });

  } catch (error) {
    console.error('DELETE /posts/[id] error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

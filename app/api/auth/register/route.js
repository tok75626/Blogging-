import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password });

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

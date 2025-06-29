import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { sanitizeHtml } from '@/lib/sanitizeHtml'; // ✅ import sanitizer
import { verifyAdminToken } from '@/lib/verifyAdmin'; // ✅ secure route

export async function POST(req: NextRequest) {
  const unauthorized = verifyAdminToken(req);
  if (unauthorized) return unauthorized;

  await dbConnect();

  try {
    const { title, content, slug } = await req.json();

    if (!title || !content || !slug) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const cleanContent = sanitizeHtml(content); // ✅ sanitize rich text

    const newPost = new Post({ title, content: cleanContent, slug });
    await newPost.save();

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

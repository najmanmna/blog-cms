import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { verifyAdminToken } from '@/lib/verifyAdmin';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

// 🔓 Public - Get a single post by slug
export async function GET(req: NextRequest) {
  await dbConnect();

  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop(); // ✅ Extract slug from URL safely

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
  }

  const post = await Post.findOne({ slug });

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

// 🔐 Protected - Update a post
export async function PUT(req: NextRequest) {
  const unauthorized = verifyAdminToken(req);
  if (unauthorized) return unauthorized;

  await dbConnect();

  const url = new URL(req.url);
  const originalSlug = url.pathname.split('/').pop(); // 🔁 original slug in URL

  try {
    const { title, content, slug: newSlug } = await req.json();

    if (!title || !content || !newSlug) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const sanitizedContent = sanitizeHtml(content);
    const safeSlug = newSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const updated = await Post.findOneAndUpdate(
      { slug: originalSlug },
      { title, content: sanitizedContent, slug: safeSlug },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// 🔐 Protected - Delete a post
export async function DELETE(req: NextRequest) {
  const unauthorized = verifyAdminToken(req);
  if (unauthorized) return unauthorized;

  await dbConnect();

  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop();

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
  }

  const deleted = await Post.findOneAndDelete({ slug });

  if (!deleted) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

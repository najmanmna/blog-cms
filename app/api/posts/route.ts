import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { verifyAdminToken } from '@/lib/verifyAdmin';
import sanitizeHtml from 'sanitize-html';

// ✅ PUBLIC: Get all blog posts (for homepage, public blog list, etc.)
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}

// ✅ PROTECTED: Create a new post (admin only)
export async function POST(req: NextRequest) {
  const unauthorized = verifyAdminToken(req);
  if (unauthorized) return unauthorized;

  await dbConnect();

  const { title, content, slug } = await req.json();

  if (!title || !content || !slug) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const existing = await Post.findOne({ slug });
  if (existing) {
    return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
  }

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title'],
      a: ['href', 'target'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });

  const newPost = await Post.create({
    title,
    content: sanitizedContent,
    slug,
  });

  return NextResponse.json({ success: true, post: newPost }, { status: 201 });
}

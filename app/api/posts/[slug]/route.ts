import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { verifyAdminToken } from '@/lib/verifyAdmin';
import { sanitizeHtml } from '@/lib/sanitizeHtml'; // ✅ import sanitizer

// ✅ Public - Fetch a single post (for edit view)
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  const post = await Post.findOne({ slug: params.slug });

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

// ✅ Protected - Update post
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const unauthorized = verifyAdminToken(req);
  if (unauthorized) return unauthorized;

  await dbConnect();

  try {
    const { title, content, slug: newSlug } = await req.json();

    if (!title || !content || !newSlug) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const sanitizedContent = sanitizeHtml(content);

    const updated = await Post.findOneAndUpdate(
      { slug: params.slug },
      { title, content: sanitizedContent, slug: newSlug },
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

// ✅ Protected - Delete post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const unauthorized = verifyAdminToken(req);
  if (unauthorized) return unauthorized;

  await dbConnect();

  const deleted = await Post.findOneAndDelete({ slug: params.slug });

  if (!deleted) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

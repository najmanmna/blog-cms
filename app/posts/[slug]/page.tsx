import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// ✅ Correct type for Next.js page props
interface PageProps {
  params: {
    slug: string;
  };
}

// ✅ Public blog post page
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params;

  await dbConnect();
  const post = await Post.findOne({ slug });

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <article className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900">{post.title}</h1>
          <div
            className="prose prose-slate prose-sm sm:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}

// ✅ Dynamic SEO metadata for each blog post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    await dbConnect();
    const post = await Post.findOne({ slug });

    if (!post) return { title: 'Post Not Found' };

    return {
      title: post.title,
      description: post.content?.replace(/<[^>]+>/g, '').slice(0, 150) || '',
    };
  } catch {
    return {
      title: 'Error',
      description: 'Could not load blog post.',
    };
  }
}

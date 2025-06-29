import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  await dbConnect();
  const post = await Post.findOne({ slug: params.slug });

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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await dbConnect();
  const post = await Post.findOne({ slug: params.slug });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.content?.replace(/<[^>]+>/g, '').slice(0, 150),
  };
}

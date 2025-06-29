import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PublicPostListPage() {
  await dbConnect();
  const posts = await Post.find().sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">📰 Blog</h1>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet!</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li
                key={post._id}
                className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-md rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:underline text-blue-600"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

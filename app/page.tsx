"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        // If your API returns { posts: [...] }
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
          📝 Najman's Blog CMS
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Create, edit, and share blog posts with ease. Built using Next.js,
          MongoDB, and TipTap.
        </p>

        <div className="flex justify-center gap-4 flex-wrap mb-14">
          <Link
            href="/blogs"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          >
            📖 View Blogs
          </Link>

          <Link
            href="/admin/posts"
            className="border border-gray-300 px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
          >
            ⚙️ Admin Dashboard
          </Link>

          <Link
            href="https://github.com/najmanmna"
            target="_blank"
            className="text-blue-500 underline underline-offset-4 py-2"
          >
            🔗 GitHub
          </Link>
        </div>
      </div>

      {/* Blog Preview Section */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Latest Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts yet.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post) => (
              <li
                key={post._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-5"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  🔗 Read More
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

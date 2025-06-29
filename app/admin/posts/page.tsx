"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPostListPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function loadPosts() {
      const res = await fetch("/api/posts", {
        headers: {
          Authorization: 'Bearer my-secret-token',

        },
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        alert("❌ Failed to load posts. Unauthorized or server error.");
      }
    }
    loadPosts();
  }, []);

  async function deletePost(slug: string, title: string) {
    const ok = confirm(`Delete "${title}"?`);
    if (!ok) return;

    const res = await fetch(`/api/posts/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer my-secret-token",
      },
    });

    if (res.ok) {
      alert("✅ Post deleted!");
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      alert("❌ Failed to delete post.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              📋 All Blog Posts
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your published content below
            </p>
          </div>
          <Link
            href="/admin/create"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            ➕ Create New Post
          </Link>
        </div>

        {/* Post List */}
        {posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts found.</div>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li
                key={post._id}
                className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  🔗 Slug:{" "}
                  <code className="bg-gray-100 px-2 py-0.5 rounded text-[13px]">
                    {post.slug}
                  </code>
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    🔍 View
                  </Link>
                  <Link
                    href={`/admin/edit/${post.slug}`}
                    className="text-yellow-600 hover:underline"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.slug, post.title)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

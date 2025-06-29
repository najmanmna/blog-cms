"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap.css";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = editor?.getHTML();
    const autoSlug = generateSlug(title);
    setSlug(autoSlug);
    setLoading(true);

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer my-secret-token",
        },
        body: JSON.stringify({ title, content, slug: autoSlug }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Post created!");
        setTitle("");
        editor?.commands.setContent("");
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            📝 Create a New Post
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const t = e.target.value;
                  setTitle(t);
                  setSlug(generateSlug(t));
                }}
                placeholder="Your awesome blog title"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <div className="border border-gray-300 rounded-xl p-3 min-h-[250px] bg-white">
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              🔗 <strong>Slug:</strong>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded-md">
                {slug || "(auto)"}
              </code>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "🚀 Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

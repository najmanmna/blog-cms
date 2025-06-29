'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import './editor.css';

export default function EditPostClient() {
  const { slug } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
    ],
    content: '',
  });

  useEffect(() => {
    if (!editor || !slug) return;

    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${slug}`);
      const data = await res.json();
      setTitle(data.title);
      setSlugInput(data.slug);
      editor.commands.setContent(data.content || '');
      setLoading(false);
    };

    fetchPost();
  }, [editor, slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer my-secret-token',
      },
      body: JSON.stringify({
        title,
        slug: slugInput,
        content: editor?.getHTML(),
      }),
    });

    if (res.ok) {
      alert('✅ Post updated!');
      router.push('/admin/posts');
    } else {
      alert('❌ Failed to update post.');
    }
  }

  if (loading || !editor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        Loading post...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">✏️ Edit Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={slugInput}
                onChange={(e) =>
                  setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <div className="border border-gray-300 rounded-xl p-3 bg-white min-h-[250px]">
                <EditorContent editor={editor} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

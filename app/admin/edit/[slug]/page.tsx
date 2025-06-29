'use client';

import EditPostClient from './EditPostClient';

export default function Page({ params }: { params: { slug: string } }) {
  return <EditPostClient slug={params.slug} />;
}

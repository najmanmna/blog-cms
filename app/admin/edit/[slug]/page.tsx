'use client';

import EditPostClient from './EditPostClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <EditPostClient slug={params.slug} />;
}

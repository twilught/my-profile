// app/blog/[slug]/page.tsx
import { getPost } from "@/lib/posts";

// ใน Next 15 บางโปรเจกต์ params ถูกพิมพ์เป็น Promise
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;           // ⬅️ แก้ตรงนี้
  const post = await getPost(slug);

  return (
    <main className="container max-w-3xl py-16">
      <h1 className="text-3xl font-bold">{post.data.title}</h1>
      {post.data.date && (
        <div className="mt-2 text-sm opacity-60">{post.data.date}</div>
      )}
      <article
        className="prose dark:prose-invert max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}

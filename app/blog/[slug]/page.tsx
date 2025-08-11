import { notFound } from "next/navigation";
import { getBySlug } from "@/lib/md";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBySlug("blog", params.slug);
  return { title: post ? `${post.data.title} — Your Name` : "Post" };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getBySlug("blog", params.slug);
  if (!post) return notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{post.data.title}</h1>
      {post.data.date && <div className="mt-2 text-sm opacity-60">{post.data.date}</div>}
      <article className="prose dark:prose-invert max-w-none mt-6" dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
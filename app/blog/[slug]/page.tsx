import { getPost } from "@/lib/posts";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

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

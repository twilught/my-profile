import Link from "next/link";
import projects from "../../data/projects.json";

export const metadata = { title: "Projects — Your Name" };

type P = { title: string; date?: string; description?: string; link?: string };

export default function ProjectsPage() {
  const list = [...(projects as P[])].sort((a,b)=> (b.date||"").localeCompare(a.date||""));
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(p => (
          <article key={p.title} className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 p-5 hover:shadow-lg hover:-translate-y-1 transition">
            <h2 className="font-semibold text-lg">{p.title}</h2>
            {p.description && <p className="mt-2 text-sm opacity-80">{p.description}</p>}
            <div className="mt-4 text-sm opacity-60">{p.date}</div>
            {p.link && <Link className="mt-4 inline-block btn btn-ghost" href={p.link} target="_blank">Visit →</Link>}
          </article>
        ))}
      </div>
    </main>
  );
}

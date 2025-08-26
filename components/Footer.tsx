export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8 text-sm opacity-80">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row gap-3 justify-between">
        <span>© {new Date().getFullYear()} Athip Buasamlee</span>
        <nav className="flex gap-5">
          <a href="/projects" className="hover:opacity-100 opacity-90">Projects</a>
          <a href="/#about" className="hover:opacity-100 opacity-90">About</a>
          <a href="/#contact" className="hover:opacity-100 opacity-90">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} <a href="https://luminacheats.com" className="hover:text-white">Lumina</a></div>
        <div className="flex items-center gap-4">
          <a className="hover:text-white" href="/pricing">Pricing</a>
          <a className="hover:text-white" href="/docs">Docs</a>
          <a className="hover:text-white" href="/status">Status</a>
        </div>
      </div>
    </footer>
  );
}



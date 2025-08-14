export default function ShowcasePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Showcase</h1>
      <p className="text-white/70 mt-2">Feature previews and UI shots.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-video rounded-xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  );
}



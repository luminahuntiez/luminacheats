export default function ReviewsPage() {
  const reviews = [
    { name: "Nova", text: "Best legit settings, super smooth.", stars: 5 },
    { name: "Spectre", text: "HWID spoofer saved my setup.", stars: 5 },
    { name: "Vex", text: "Fast updates and helpful staff.", stars: 4 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Reviews</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.name}</span>
              <span className="text-yellow-400">{"★".repeat(r.stars)}</span>
            </div>
            <p className="text-white/80 mt-2 text-sm">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



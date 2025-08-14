import Link from "next/link";

export default function PricingPage() {
  const plans = [
    { name: "Free", price: "$0", features: ["Community access", "Free loader"], cta: "/downloads" },
    { name: "Premium", price: "$119/mo", features: ["All cheats", "HWID spoofer", "Discord role", "Lifetime access", "Priority support"], cta: "https://luminacheats.com" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-white/70 mt-2">Purchase Premium to receive the Discord role and unlock downloads.</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div key={p.name} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <div className="text-3xl font-bold mt-2">{p.price}</div>
            <ul className="mt-4 space-y-1 text-white/80 text-sm">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <Link href={p.cta} className="mt-6 inline-block px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white">
              {p.name === "Premium" ? "Join Discord to Purchase" : "Get Started"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}



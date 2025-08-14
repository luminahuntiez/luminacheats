import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function DownloadsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Downloads
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          Access our premium loaders and spoofers. Discord role required for premium downloads.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProductCard slug="temp-spoofer-loader" title="Temp Spoofer Loader" />
        <ProductCard slug="fortnite-private-loader" title="Fortnite Private Loader" />
        <ProductCard slug="cs2-premium-loader" title="CS2 Premium Loader" />
        <ProductCard slug="free-cs2" title="Free CS2" free />
        <ProductCard slug="free-temp-spoofer" title="Free Temp Spoofer" free />
      </div>

      {/* Info Section */}
      <div className="mt-16 text-center">
        <div className="max-w-2xl mx-auto p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">How it works</h3>
          <p className="text-white/70 leading-relaxed">
            Premium products require Discord authentication and specific roles. 
            Free products are available to everyone. Join our Discord to get access to premium features.
          </p>
        </div>
      </div>
    </div>
  );
}



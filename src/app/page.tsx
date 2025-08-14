import ReviewsMarquee from "@/components/ReviewsMarquee";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 border border-white/20 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black rounded-full"></div>
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 w-10 h-10 rounded-full bg-white transform -translate-x-1"></div>
                <div className="absolute inset-0 w-10 h-10 rounded-full bg-black transform translate-x-1"></div>
              </div>
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
              <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
              <div className="absolute bottom-1 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          Lumina Cheats
        </h1>
        <p className="text-xl md:text-2xl text-purple-300 mb-4 font-medium">
          Premium gaming solutions
        </p>
        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Experience the next level of gaming with our advanced loaders and spoofers. 
          Secure, reliable, and always up-to-date.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a 
            href="/downloads" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </a>
          <a 
            href="/pricing" 
            className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm bg-white/5"
          >
            View Pricing
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Lumina?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
            <p className="text-white/70">Built with security in mind. Your safety is our top priority.</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-white/70">Optimized for performance. Get the edge you need instantly.</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Always Updated</h3>
            <p className="text-white/70">Regular updates ensure compatibility with the latest games.</p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Showcase</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="aspect-video rounded-2xl border border-white/10 bg-purple-500/10 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white/50">
              <div className="text-4xl mb-2">🎮</div>
              <div>Coming Soon</div>
            </div>
          </div>
          <div className="aspect-video rounded-2xl border border-white/10 bg-green-500/10 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white/50">
              <div className="text-4xl mb-2">⚡</div>
              <div>Coming Soon</div>
            </div>
          </div>
          <div className="aspect-video rounded-2xl border border-white/10 bg-orange-500/10 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white/50">
              <div className="text-4xl mb-2">🛡️</div>
              <div>Coming Soon</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">What our users say</h2>
        <ReviewsMarquee />
      </section>
    </div>
  );
}

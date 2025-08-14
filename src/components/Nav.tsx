"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();

  return (
    <header className="w-full sticky top-4 z-50 px-4 py-2">
      <div className="mx-auto max-w-6xl">
        <nav className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl shadow-black/20">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg shadow-white/20 flex items-center justify-center relative overflow-hidden">
              {/* Dark background representing night sky */}
              <div className="absolute inset-0 bg-slate-900 rounded-full"></div>
              {/* Crescent moon */}
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 w-5 h-5 rounded-full bg-slate-100 transform -translate-x-1"></div>
                <div className="absolute inset-0 w-5 h-5 rounded-full bg-slate-900 transform translate-x-1"></div>
              </div>
              {/* Subtle stars */}
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-slate-300 rounded-full opacity-60"></div>
              <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-slate-300 rounded-full opacity-40"></div>
              <div className="absolute bottom-1 left-2 w-0.5 h-0.5 bg-slate-300 rounded-full opacity-50"></div>
            </div>
            <Link href="/" className="text-white font-semibold tracking-wide text-lg">
              Lumina Cheats
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/downloads" className="text-white/80 hover:text-white transition-colors font-medium">
              Downloads
            </Link>
            <Link href="/docs" className="text-white/80 hover:text-white transition-colors font-medium">
              Docs
            </Link>
            <Link href="/showcase" className="text-white/80 hover:text-white transition-colors font-medium">
              Showcase
            </Link>
            <Link href="/reviews" className="text-white/80 hover:text-white transition-colors font-medium">
              Reviews
            </Link>
            <Link href="/status" className="text-white/80 hover:text-white transition-colors font-medium">
              Status
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img 
                    src={session.user?.image || ''} 
                    alt="avatar" 
                    className="w-6 h-6 rounded-full ring-1 ring-white/20"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-white/80 text-sm font-medium">
                    {session.user?.name || 'User'}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Login with Discord</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}



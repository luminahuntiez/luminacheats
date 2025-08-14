"use client";

import { useEffect, useState } from "react";

interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  stars: number;
  message: string;
  imageUrl?: string;
  createdAt: number;
}

// Generate placeholder avatar based on username
function getPlaceholderAvatar(username: string) {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const colorIndex = username.charCodeAt(0) % colors.length;
  const initials = username.slice(0, 2).toUpperCase();
  
  return (
    <div className={`w-10 h-10 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-semibold text-sm`}>
      {initials}
    </div>
  );
}

export default function ReviewsMarquee() {
  const [list, setList] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setList(data.reviews || []))
      .catch(console.error);
  }, []);

  if (list.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 text-white/50">
        <div className="text-center">
          <div className="text-2xl mb-2">⭐</div>
          <div>No reviews yet. Be the first to leave one!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-6 animate-marquee">
        {[...list, ...list].map((r, i) => (
          <div key={r.id + i} className="min-w-[300px] max-w-[340px] rounded-xl border border-white/10 bg-white/5 p-4 flex-shrink-0 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              {r.authorAvatar ? (
                <img 
                  src={r.authorAvatar} 
                  alt={r.authorName}
                  className="w-10 h-10 rounded-full ring-2 ring-white/20"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                  }}
                />
              ) : null}
              {(!r.authorAvatar || r.authorAvatar === '') && getPlaceholderAvatar(r.authorName)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white truncate">{r.authorName}</span>
                  <div className="flex text-yellow-400 text-sm">
                    {"⭐".repeat(r.stars)}
                    {"☆".repeat(5 - r.stars)}
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{r.message}</p>
                <div className="text-white/50 text-xs mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}



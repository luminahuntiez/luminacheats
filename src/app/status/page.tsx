"use client";

import { useEffect, useState } from "react";

interface StatusData {
  products: {
    [key: string]: {
      name: string;
      status: string;
      color: string;
      lastUpdated: number;
    };
  };
}

function getStatusColor(color: string) {
  switch (color) {
    case "green": return "text-green-400";
    case "orange": return "text-orange-400";
    case "red": return "text-red-400";
    default: return "text-green-400";
  }
}

function getStatusBgColor(color: string) {
  switch (color) {
    case "green": return "bg-green-500/10 border-green-500/30";
    case "orange": return "bg-orange-500/10 border-orange-500/30";
    case "red": return "bg-red-500/10 border-red-500/30";
    default: return "bg-green-500/10 border-green-500/30";
  }
}

export default function StatusPage() {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setStatusData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching status:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/70">Loading status...</p>
        </div>
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <p className="text-red-400">Failed to load status data</p>
        </div>
      </div>
    );
  }

  const products = Object.entries(statusData.products);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          System Status
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          Real-time status of all Lumina services and products
        </p>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(([key, product]) => (
          <div 
            key={key} 
            className={`rounded-2xl border p-6 backdrop-blur-sm transition-all duration-200 ${getStatusBgColor(product.color)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-white">{product.name}</h3>
              <div className={`w-3 h-3 rounded-full ${product.color === 'green' ? 'bg-green-400' : product.color === 'orange' ? 'bg-orange-400' : 'bg-red-400'}`}></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Status:</span>
                <span className={`font-medium capitalize ${getStatusColor(product.color)}`}>
                  {product.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Last Updated:</span>
                <span className="text-white/60 text-sm">
                  {new Date(product.lastUpdated).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Legend */}
      <div className="mt-16">
        <div className="max-w-2xl mx-auto p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 text-center">Status Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white/80">Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-white/80">Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span className="text-white/80">Degraded</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-white/80">Outage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



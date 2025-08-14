"use client";

import { useEffect, useState } from "react";

export default function MaintenanceOverlay() {
  const [maintenanceData, setMaintenanceData] = useState<{
    enabled: boolean;
    lastUpdated: number;
    enabledBy: string | null;
    countdown?: number;
    reason?: string;
  } | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/maintenance")
      .then((res) => res.json())
      .then((data) => setMaintenanceData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (maintenanceData?.countdown) {
      const interval = setInterval(() => {
        const now = Date.now();
        const endTime = maintenanceData.countdown!;
        const remaining = Math.max(0, endTime - now);
        
        if (remaining <= 0) {
          // Countdown finished, refresh page to check if maintenance is disabled
          window.location.reload();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [maintenanceData?.countdown]);

  if (!maintenanceData?.enabled) {
    return null;
  }

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl">
          {/* Warning Triangle */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Red Triangle */}
              <div className="w-32 h-28 bg-red-600 transform rotate-45 relative">
                {/* Person at Computer Icon */}
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                  <div className="w-16 h-12 relative">
                    {/* Monitor */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-black rounded-sm"></div>
                    {/* Desk */}
                    <div className="absolute bottom-0 left-0 w-16 h-2 bg-black"></div>
                    {/* Person */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      {/* Head */}
                      <div className="w-3 h-3 bg-black rounded-full mx-auto"></div>
                      {/* Body */}
                      <div className="w-4 h-4 bg-black mx-auto mt-1"></div>
                      {/* Arms */}
                      <div className="w-8 h-1 bg-black mx-auto mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-wider">
            <span className="text-red-600">PAGE IS</span><br />
            <span className="text-black">UNDER CONSTRUCTION</span>
          </h1>

          {/* Reason */}
          {maintenanceData.reason && (
            <p className="text-lg text-black/80 max-w-xl mx-auto leading-relaxed mb-8">
              {maintenanceData.reason}
            </p>
          )}

          {/* Countdown */}
          {timeLeft !== null && (
            <div className="mb-8">
              <p className="text-lg text-black/70 mb-2">Estimated completion time:</p>
              <div className="text-3xl font-mono font-bold text-red-600">
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="text-black/60 text-sm">
            {maintenanceData.enabledBy && (
              <p>Enabled by: {maintenanceData.enabledBy}</p>
            )}
            <p>Last updated: {new Date(maintenanceData.lastUpdated).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

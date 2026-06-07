"use client";

import { useState, useEffect, useRef } from "react";

interface AutoRefreshCountdownProps {
  pollInterval: number; // in milliseconds
  resetKey: number;
}

export default function AutoRefreshCountdown({
  pollInterval,
  resetKey,
}: AutoRefreshCountdownProps) {
  const [countdown, setCountdown] = useState(pollInterval / 1000);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset countdown when resetKey changes (which happens when manual refresh or auto-fetch happens)
    setCountdown(pollInterval / 1000);

    // Clear any existing interval
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Start a new interval
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : pollInterval / 1000));
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [pollInterval, resetKey]);

  return (
    <div className="refresh-countdown">
      <span className="countdown-label">Auto-refresh</span>
      <span className="countdown-value">
        {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
      </span>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

type CountdownProps = {
  targetDate: string;
};

export default function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 2000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-surface/80 backdrop-blur-md rounded-lg p-3 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-text-secondary uppercase">Hari</div>
        </div>

        <div className="bg-surface/80 backdrop-blur-md rounded-lg p-3 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-text-secondary uppercase">Jam</div>
        </div>

        <div className="bg-surface/80 backdrop-blur-md rounded-lg p-3 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-text-secondary uppercase">Menit</div>
        </div>

        <div className="bg-surface/80 backdrop-blur-md rounded-lg p-3 min-w-[80px]">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-text-secondary uppercase">Detik</div>
        </div>
      </div>
    </div>
  );
}

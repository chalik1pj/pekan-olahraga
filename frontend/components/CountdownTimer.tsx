"use client"

import { useState, useEffect } from "react"

type CountdownProps = {
  targetDate: string
}

export default function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    // Calculate initial time immediately
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    // Set initial time immediately
    setTimeLeft(calculateTimeLeft())

    // Update every second (1000ms instead of 2000ms)
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      // Clear interval when countdown reaches zero
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(interval)
      }
    }, 1000) // Changed from 2000 to 1000 milliseconds

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 min-w-[80px] shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{timeLeft.days}</div>
          <div className="text-xs text-gray-600 uppercase">Hari</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 min-w-[80px] shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{timeLeft.hours}</div>
          <div className="text-xs text-gray-600 uppercase">Jam</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 min-w-[80px] shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-600 uppercase">Menit</div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-lg p-3 min-w-[80px] shadow-lg">
          <div className="text-3xl font-bold text-gray-900">{timeLeft.seconds}</div>
          <div className="text-xs text-gray-600 uppercase">Detik</div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"

interface TransitionLoadingProps {
  username?: string
}

export function TransitionLoading({ username }: TransitionLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [buildings, setBuildings] = useState<Array<{ height: number; width: number; x: number; delay: number }>>([])

  useEffect(() => {
    // Generate random buildings for the skyline
    const generatedBuildings = Array.from({ length: 20 }, (_, i) => ({
      height: 40 + Math.random() * 140, // Random height between 40 and 180px
      width: 15 + Math.random() * 20, // Random width between 15 and 35px
      x: i * 30 + Math.random() * 15, // Position with some randomness
      delay: Math.random() * 0.5, // Random delay for animation
    }))
    setBuildings(generatedBuildings)

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Logo and username */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 text-3xl font-bold mb-3">
          <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6 text-primary-foreground"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </div>
          <span className="font-display">CommitCanvas</span>
        </div>
        {username && (
          <div className="text-lg font-medium animate-pulse">
            Loading <span className="text-primary">@{username}</span>'s contributions...
          </div>
        )}
      </div>

      {/* Skyline animation */}
      <div className="relative w-full max-w-2xl h-60 mb-8">
        <div className="absolute bottom-0 left-0 right-0 flex items-end h-full">
          {buildings.map((building, i) => (
            <div
              key={i}
              className="relative mx-1 bg-primary/20 rounded-sm"
              style={{
                height: `0px`,
                width: `${building.width}px`,
                marginLeft: i === 0 ? `${building.x}px` : undefined,
                animation: `buildingRise 1.5s ease-out ${building.delay}s forwards`,
              }}
            >
              {/* Add windows */}
              {Array.from({ length: Math.floor(building.height / 15) }).map((_, j) => (
                <div
                  key={j}
                  className="absolute left-0 right-0 mx-auto w-2/3 h-2 bg-primary/40 rounded-sm"
                  style={{
                    bottom: 10 + j * 15,
                    opacity: 0,
                    animation: `fadeIn 0.5s ease-out ${building.delay + 1 + j * 0.1}s forwards`,
                  }}
                />
              ))}

              {/* Add antenna to some buildings */}
              {building.height > 120 && (
                <div
                  className="absolute left-0 right-0 mx-auto w-1 bg-primary/60 rounded-full"
                  style={{
                    bottom: building.height,
                    height: 0,
                    animation: `antennaRise 0.5s ease-out ${building.delay + 1.5}s forwards`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/50" />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-2">
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">Building skyline... {Math.round(progress)}%</div>
    </div>
  )
}


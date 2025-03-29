"use client"

import { useEffect, useState } from "react"

export function LoadingSkyline() {
  const [progress, setProgress] = useState(0)
  const [buildings, setBuildings] = useState<Array<{ height: number; width: number; left: number }>>([])

  useEffect(() => {
    // Generate random buildings for the loading skyline
    const newBuildings = Array.from({ length: 10 }, () => ({
      height: 20 + Math.random() * 60,
      width: 10 + Math.random() * 15,
      left: Math.random() * 80,
    }))
    setBuildings(newBuildings)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-md border border-border/50">
      <div className="space-y-4 text-center">
        <div className="relative h-40 w-40">
          {/* Animated city silhouette */}
          <div className="absolute inset-0 flex items-end justify-center">
            {buildings.map((building, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-primary/20 rounded-sm"
                style={{
                  height: `${building.height}px`,
                  width: `${building.width}px`,
                  left: `${building.left}%`,
                  animation: `buildingRise 1s ease-out ${i * 0.1}s`,
                  animationFillMode: "backwards",
                }}
              >
                {/* Windows */}
                {Array.from({ length: Math.floor(building.height / 10) }).map((_, j) => (
                  <div
                    key={j}
                    className="absolute left-0 right-0 mx-auto w-2/3 h-1 bg-primary/40 rounded-sm"
                    style={{
                      bottom: 5 + j * 10,
                      opacity: Math.random() > 0.3 ? 1 : 0,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Rotating circle */}
          <svg className="animate-spin-slow" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Building Skyline</h3>
          <p className="text-sm text-muted-foreground">Constructing your contribution visualization...</p>
          <div className="w-full max-w-xs mx-auto bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </div>
      </div>
    </div>
  )
}


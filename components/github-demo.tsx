"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function GithubDemo() {
  const [activeCell, setActiveCell] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCell(Math.floor(Math.random() * 365))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Use a consistent seed pattern for contributions to avoid hydration errors
  const [contributions, setContributions] = useState(() => {
    return Array.from({ length: 365 }, (_, i) => ({
      id: i,
      // Use predictable pattern based on day number instead of random
      level: (i % 5),
      highlight: false,
    }))
  })
  
  // Update the highlighted cell only after initial render
  useEffect(() => {
    setContributions(prev => prev.map(item => ({
      ...item,
      highlight: item.id === activeCell
    })))
  }, [activeCell])

  return (
    <Card className="w-full max-w-md overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full p-2 text-muted-foreground"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="font-bold">GitHub User</div>
            <div className="text-sm text-muted-foreground">@username</div>
          </div>
        </div>

        <div className="rounded-md p-4 bg-secondary border border-border/50">
          <div className="text-sm font-medium mb-2">Contributions</div>
          <div className="grid grid-cols-[repeat(53,1fr)] gap-1">
            {contributions.map((day) => (
              <div
                key={day.id}
                className={`aspect-square rounded-sm ${
                  day.highlight ? "bg-primary animate-pulse" : `contribution-level-${day.level}`
                }`}
              />
            ))}
          </div>

          <div className="mt-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Total Contributions</div>
              <div className="text-xl font-bold">2,543</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-center text-muted-foreground">
          Interactive visualization with embed functionality
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useEffect, useRef, useState } from "react"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"

interface ThreeDBarViewProps {
  contributions: ContributionDay[]
  height?: number
}

export function ThreeDBarView({ contributions, height = 400 }: ThreeDBarViewProps) {
  const { getContributionColor, colorPalette } = useVisualization()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Ensure we have valid contributions
  if (!contributions || !Array.isArray(contributions) || contributions.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Group contributions by month
  const monthlyData = contributions.reduce(
    (acc, day) => {
      if (!day || !day.date) return acc

      try {
        const date = new Date(day.date)
        const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

        if (!acc[monthYear]) {
          acc[monthYear] = { month: monthYear, count: 0 }
        }

        acc[monthYear].count += day.count || 0
      } catch (error) {
        console.error("Error processing contribution day:", error)
      }

      return acc
    },
    {} as Record<string, { month: string; count: number }>,
  )

  // Convert to array and sort chronologically
  const chartData = Object.values(monthlyData).sort((a, b) => {
    if (!a.month || !b.month) return 0

    try {
      const [aMonth, aYear] = a.month.split(" ")
      const [bMonth, bYear] = b.month.split(" ")

      const aDate = new Date(`${aMonth} 1, ${aYear}`)
      const bDate = new Date(`${bMonth} 1, ${bYear}`)

      return aDate.getTime() - bDate.getTime()
    } catch (error) {
      console.error("Error sorting chart data:", error)
      return 0
    }
  })

  // Find the maximum count for scaling
  const maxCount = Math.max(...chartData.map((d) => d.count), 1)

  // Check if we should use gradient styles
  const useGradient = colorPalette === "holographic" || colorPalette === "gradient"

  if (!isClient) {
    return <div style={{ height: `${height}px` }} className="bg-secondary/20 animate-pulse rounded-md" />
  }

  return (
    <div ref={containerRef} className="graph-3d-container" style={{ height: `${height}px`, overflow: "hidden" }}>
      <div className="graph-3d w-full h-full flex items-end justify-center gap-2 p-4">
        {chartData.map((item, index) => {
          const barHeight = (item.count / maxCount) * (height * 0.8)
          const level = Math.min(4, Math.ceil((item.count / maxCount) * 4))

          return (
            <div key={index} className="relative flex flex-col items-center" style={{ height: `${height * 0.9}px` }}>
              <div
                className={`
                  w-12 rounded-t-md
                  ${useGradient ? `contribution-gradient-${level}` : `contribution-level-${level}`}
                  ${colorPalette === "holographic" ? "holographic-effect" : ""}
                `}
                style={{
                  height: `${Math.max(5, barHeight)}px`,
                  transformOrigin: "bottom",
                  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                  transition: "height 0.5s ease",
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                  {item.count}
                </div>
              </div>
              <div className="mt-2 text-xs transform -rotate-45 origin-left whitespace-nowrap">{item.month}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


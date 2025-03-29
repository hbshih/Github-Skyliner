"use client"

import { useState } from "react"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeatmapViewProps {
  contributions: ContributionDay[]
  height?: number
}

export function HeatmapView({ contributions, height = 400 }: HeatmapViewProps) {
  const { getContributionColor, colorPalette, is3DEnabled } = useVisualization()
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null)

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
          acc[monthYear] = []
        }

        acc[monthYear].push(day)
      } catch (error) {
        console.error("Error processing contribution day:", error)
      }

      return acc
    },
    {} as Record<string, ContributionDay[]>,
  )

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    try {
      const [aMonth, aYear] = a.split(" ")
      const [bMonth, bYear] = b.split(" ")

      const aDate = new Date(`${aMonth} 1, ${aYear}`)
      const bDate = new Date(`${bMonth} 1, ${bYear}`)

      return aDate.getTime() - bDate.getTime()
    } catch (error) {
      console.error("Error sorting months:", error)
      return 0
    }
  })

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return dateStr
    }
  }

  // Check if we should use gradient styles
  const useGradient = colorPalette === "holographic" || colorPalette === "gradient"

  return (
    <div className="space-y-6" style={{ minHeight: `${height}px` }}>
      <TooltipProvider>
        {sortedMonths.map((month) => (
          <div key={month} className="space-y-2">
            <h3 className="text-sm font-medium">{month}</h3>
            <div className="heatmap-container">
              {monthlyData[month].map((day, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        heatmap-cell
                        ${useGradient ? `contribution-gradient-${day.level || 0}` : `contribution-level-${day.level || 0}`}
                        ${is3DEnabled ? "cell-3d" : ""}
                        ${colorPalette === "holographic" ? "holographic-effect" : ""}
                      `}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div>{formatDate(day.date)}</div>
                      <div className="font-semibold">{day.count} contributions</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </TooltipProvider>

      {hoveredDay && (
        <div className="fixed bottom-4 right-4 bg-secondary p-2 rounded-md shadow-lg text-xs hidden md:block">
          <div>{formatDate(hoveredDay.date)}</div>
          <div className="font-semibold">{hoveredDay.count} contributions</div>
        </div>
      )}
    </div>
  )
}


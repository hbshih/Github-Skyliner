"use client"

import { useState } from "react"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CalendarViewProps {
  contributions: ContributionDay[]
  height?: number
  showDataLabels?: boolean
  showGridLines?: boolean
  showLegend?: boolean
  is3DEnabled?: boolean
  animate?: boolean
  border?: string
  background?: string
}

export function CalendarView({
  contributions,
  height = 400,
  showDataLabels = false,
  showGridLines = true,
  showLegend = true,
  is3DEnabled = false,
  animate = true,
  border = "none",
  background = "solid",
}: CalendarViewProps) {
  const { getContributionColor, colorPalette } = useVisualization()
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null)

  // Ensure we have valid contributions
  if (!contributions || !Array.isArray(contributions) || contributions.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Apply border and background styles
  const containerClasses = `
    relative overflow-hidden rounded-md
    ${border === "solid" ? "border border-border" : ""}
    ${border === "gradient" ? "chart-border-gradient" : ""}
    ${background === "transparent" ? "bg-transparent" : ""}
  `

  // Group contributions by week
  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []

  // Filter out invalid contributions and sort by date
  const validContributions = contributions
    .filter((day) => day && day.date)
    .sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } catch (error) {
        console.error("Error sorting contributions:", error)
        return 0
      }
    })

  // Group by week (7 days)
  validContributions.forEach((day, index) => {
    currentWeek.push(day)

    if (currentWeek.length === 7 || index === validContributions.length - 1) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  if (weeks.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return dateStr
    }
  }

  // Check if we should use gradient styles
  const useGradient = colorPalette === "holographic" || colorPalette === "gradient"

  return (
    <div className={containerClasses} style={{ minHeight: `${height}px` }}>
      <TooltipProvider>
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-2">
            {new Date(weeks[0][0].date).getFullYear()} GitHub Contribution Calendar
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[750px]">
              <div className="grid grid-cols-[auto_repeat(53,1fr)] gap-1">
                {/* Day of week labels */}
                <div className="grid grid-rows-7 gap-1 mr-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div key={index} className="flex items-center justify-end h-[14px]">
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar cells */}
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 gap-1">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              aspect-square rounded-sm h-[14px] w-[14px] cursor-pointer
                              ${useGradient ? `contribution-gradient-${day.level || 0}` : `contribution-level-${day.level || 0}`}
                              ${is3DEnabled ? "cell-3d" : ""}
                              ${colorPalette === "holographic" ? "holographic-effect" : ""}
                              ${animate ? "calendar-cell-animate" : ""}
                            `}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <div>{formatDate(day.date)}</div>
                            <div className="font-semibold">
                              {day.count} contribution{day.count !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Month labels */}
          <div className="grid grid-cols-[auto_repeat(12,1fr)] gap-1 min-w-[750px] mt-1">
            <div></div>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
              (month, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {month}
                </div>
              ),
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* Legend */}
      {showLegend && (
        <div className="px-4 pb-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`
                w-3 h-3 rounded-sm
                ${useGradient ? `contribution-gradient-${level}` : `contribution-level-${level}`}
                ${colorPalette === "holographic" ? "holographic-effect" : ""}
              `}
            />
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      )}

      {/* Hover info overlay */}
      {hoveredDay && (
        <div className="fixed bottom-4 right-4 bg-secondary p-2 rounded-md shadow-lg text-xs hidden md:block">
          <div>{formatDate(hoveredDay.date)}</div>
          <div className="font-semibold">
            {hoveredDay.count} contribution{hoveredDay.count !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  )
}


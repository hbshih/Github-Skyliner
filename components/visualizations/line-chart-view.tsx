"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface LineChartViewProps {
  contributions: ContributionDay[]
  height?: number
}

export function LineChartView({ contributions, height = 400 }: LineChartViewProps) {
  const { getContributionColor } = useVisualization()

  // Ensure we have valid contributions
  if (!contributions || !Array.isArray(contributions) || contributions.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Group contributions by week
  const weeklyData = contributions.reduce(
    (acc, day, index) => {
      if (!day || !day.date) return acc

      try {
        const date = new Date(day.date)
        const weekNumber = Math.floor(index / 7)
        const weekLabel = `Week ${weekNumber + 1}`

        if (!acc[weekLabel]) {
          acc[weekLabel] = { week: weekLabel, count: 0, date: date.toISOString().split("T")[0] }
        }

        acc[weekLabel].count += day.count || 0
      } catch (error) {
        console.error("Error processing contribution day:", error)
      }

      return acc
    },
    {} as Record<string, { week: string; count: number; date: string }>,
  )

  // Convert to array and sort chronologically
  const chartData = Object.values(weeklyData).sort((a, b) => {
    if (!a.date || !b.date) return 0

    try {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } catch (error) {
      console.error("Error sorting chart data:", error)
      return 0
    }
  })

  if (chartData.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  return (
    <div style={{ height: `${height}px` }}>
      <ChartContainer
        config={{
          count: {
            label: "Contributions",
            color: "hsl(var(--primary))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} interval={Math.floor(Math.max(1, chartData.length / 10))} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Contributions"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}


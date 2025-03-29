"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartViewProps {
  contributions: ContributionDay[]
  height?: number
}

export function BarChartView({ contributions, height = 400 }: BarChartViewProps) {
  const { getContributionColor } = useVisualization()

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
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} name="Contributions" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}


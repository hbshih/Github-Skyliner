"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RadarChartViewProps {
  contributions: ContributionDay[]
  height?: number
}

export function RadarChartView({ contributions, height = 400 }: RadarChartViewProps) {
  const { getContributionColor } = useVisualization()

  // Ensure we have valid contributions
  if (!contributions || !Array.isArray(contributions) || contributions.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Group contributions by month
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const monthlyData = contributions.reduce(
    (acc, day) => {
      if (!day || !day.date) return acc

      try {
        const date = new Date(day.date)
        const month = monthNames[date.getMonth()]

        if (!acc[month]) {
          acc[month] = { subject: month, A: 0 }
        }

        acc[month].A += day.count || 0
      } catch (error) {
        console.error("Error processing contribution day:", error)
      }

      return acc
    },
    {} as Record<string, { subject: string; A: number }>,
  )

  // Convert to array and ensure all months are represented
  const chartData = monthNames.map((month) => ({
    subject: month,
    A: monthlyData[month]?.A || 0,
  }))

  // Check if we have any contributions
  const hasContributions = chartData.some((item) => item.A > 0)

  if (!hasContributions) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  return (
    <div style={{ height: `${height}px` }}>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="Contributions"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.6)"
              fillOpacity={0.6}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}


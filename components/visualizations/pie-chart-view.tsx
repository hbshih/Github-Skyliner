"use client"

import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PieChartViewProps {
  contributions: ContributionDay[]
  height?: number
}

export function PieChartView({ contributions, height = 400 }: PieChartViewProps) {
  const { getContributionColor } = useVisualization()

  // Ensure we have valid contributions
  if (!contributions || !Array.isArray(contributions) || contributions.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Group contributions by day of week
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const dayOfWeekData = contributions.reduce(
    (acc, day) => {
      if (!day || !day.date) return acc

      try {
        const date = new Date(day.date)
        const dayOfWeek = dayNames[date.getDay()]

        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = { name: dayOfWeek, value: 0 }
        }

        acc[dayOfWeek].value += day.count || 0
      } catch (error) {
        console.error("Error processing contribution day:", error)
      }

      return acc
    },
    {} as Record<string, { name: string; value: number }>,
  )

  // Convert to array and ensure all days are represented
  const chartData = dayNames.map((day) => ({
    name: day,
    value: dayOfWeekData[day]?.value || 0,
  }))

  // Check if we have any contributions
  const hasContributions = chartData.some((item) => item.value > 0)

  if (!hasContributions) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Custom colors for the pie chart
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-2) / 0.7)",
    "hsl(var(--chart-3) / 0.7)",
  ]

  return (
    <div style={{ height: `${height}px` }}>
      <ChartContainer
        config={{
          contributions: {
            label: "Contributions",
            color: "hsl(var(--primary))"
          }
        }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}


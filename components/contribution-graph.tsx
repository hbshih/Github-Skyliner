"use client"

import { useState, useEffect } from "react"
import { getContributions, type ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { SkylineView } from "@/components/visualizations/skyline-view"
import { CalendarView } from "@/components/visualizations/calendar-view" // Add this import
import { LoadingSkyline } from "@/components/loading-skyline"

interface ContributionGraphProps {
  username: string
  height?: number
}

export function ContributionGraph({ username, height = 400 }: ContributionGraphProps) {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    streak: 0,
    maxStreak: 0,
  })

  const {
    visualizationType,
    showDataLabels,
    showGridLines,
    showLegend,
    is3DEnabled,
    animateCharts,
    chartBorder,
    chartBackground,
  } = useVisualization()

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        setError("No username provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const data = await getContributions(username)

        if (!data || !data.contributionDays) {
          throw new Error("Invalid contribution data received")
        }

        setContributions(data.contributionDays)
        setStats({
          total: data.totalContributions || 0,
          streak: data.currentStreak || 0,
          maxStreak: data.longestStreak || 0,
        })
        setError(null)
      } catch (err) {
        setError(`Failed to fetch contribution data: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchData()
    }
  }, [username])

  if (loading) {
    return <LoadingSkyline />
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  // Ensure we have valid contributions
  if (!contributions || !Array.isArray(contributions) || contributions.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Common props for visualizations
  const commonProps = {
    showDataLabels,
    showGridLines,
    showLegend,
    is3DEnabled,
    animate: animateCharts,
    border: chartBorder,
    background: chartBackground,
  }

  return (
    <div className="space-y-4">
      {visualizationType === "skyline" ? (
        <SkylineView contributions={contributions} height={height} username={username} {...commonProps} />
      ) : (
        <CalendarView contributions={contributions} height={height} {...commonProps} />
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border/50 bg-secondary p-3">
          <div className="text-sm text-muted-foreground">Total Contributions</div>
          <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-border/50 bg-secondary p-3">
          <div className="text-sm text-muted-foreground">Current Streak</div>
          <div className="text-2xl font-bold">{stats.streak} days</div>
        </div>
        <div className="rounded-lg border border-border/50 bg-secondary p-3">
          <div className="text-sm text-muted-foreground">Longest Streak</div>
          <div className="text-2xl font-bold">{stats.maxStreak} days</div>
        </div>
      </div>
    </div>
  )
}


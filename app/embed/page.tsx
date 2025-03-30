"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { ContributionGraph } from "@/components/contribution-graph"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUser, type GitHubUser } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"

export default function EmbedPage() {
  const searchParams = useSearchParams()
  const username = searchParams?.get("username") || ""
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Get visualization preferences from URL if provided
  const visualTypeParam = searchParams?.get("visualType") as any
  const colorPaletteParam = searchParams?.get("colorPalette") as any
  const is3DEnabledParam = searchParams?.get("is3DEnabled")
  const showDataLabelsParam = searchParams?.get("showDataLabels")

  const sortDataParam = searchParams?.get("sortData")
  const chartBorderParam = searchParams?.get("chartBorder")
  const chartBackgroundParam = searchParams?.get("chartBackground")
  const textSizeParam = searchParams?.get("textSize")
  const fontStyleParam = searchParams?.get("fontStyle")
  const showLegendParam = searchParams?.get("showLegend")
  const legendPositionParam = searchParams?.get("legendPosition")
  const barChartStyleParam = searchParams?.get("barChartStyle")
  const headlineNumberParam = searchParams?.get("headlineNumber")
  const startFromZeroParam = searchParams?.get("startFromZero")
  const useCurvedLinesParam = searchParams?.get("useCurvedLines")
  const animateChartsParam = searchParams?.get("animateCharts")

  const {
    setVisualizationType,
    setColorPalette,
    setIs3DEnabled,
    setShowDataLabels,
    setSortData,
    setChartBorder,
    setChartBackground,
    setTextSize,
    setFontStyle,
    setShowLegend,
    setLegendPosition,
    setBarChartStyle,
    setHeadlineNumber,
    setStartFromZero,
    setUseCurvedLines,
    setAnimateCharts,
    chartBackground,
    chartBorder,
  } = useVisualization()

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply URL parameters for visualization if provided
  useEffect(() => {
    if (!mounted) return

    if (visualTypeParam && ["calendar", "bar", "line", "heatmap", "3d-bar", "skyline"].includes(visualTypeParam)) {
      setVisualizationType(visualTypeParam)
    }

    if (
      colorPaletteParam &&
      [
        "default",
        "github",
        "neon",
        "pastel",
        "monochrome",
        "cyberpunk",
        "gradient",
        "holographic",
        "sunset",
        "ocean",
      ].includes(colorPaletteParam)
    ) {
      setColorPalette(colorPaletteParam)
    }

    if (is3DEnabledParam !== null) {
      setIs3DEnabled(is3DEnabledParam === "true")
    }

    if (showDataLabelsParam !== null) {
      setShowDataLabels(showDataLabelsParam === "true")
    }


    if (sortDataParam !== null) {
      setSortData(sortDataParam === "true")
    }

    if (chartBorderParam) {
      setChartBorder(chartBorderParam)
    }

    if (chartBackgroundParam) {
      setChartBackground(chartBackgroundParam)
    }

    if (textSizeParam) {
      setTextSize(textSizeParam)
    }

    if (fontStyleParam) {
      setFontStyle(fontStyleParam)
    }

    if (showLegendParam !== null) {
      setShowLegend(showLegendParam === "true")
    }

    if (legendPositionParam) {
      setLegendPosition(legendPositionParam)
    }

    if (barChartStyleParam) {
      setBarChartStyle(barChartStyleParam)
    }

    if (headlineNumberParam) {
      setHeadlineNumber(headlineNumberParam)
    }

    if (startFromZeroParam !== null) {
      setStartFromZero(startFromZeroParam === "true")
    }

    if (useCurvedLinesParam !== null) {
      setUseCurvedLines(useCurvedLinesParam === "true")
    }

    if (animateChartsParam !== null) {
      setAnimateCharts(animateChartsParam === "true")
    }
  }, [
    visualTypeParam,
    colorPaletteParam,
    is3DEnabledParam,
    showDataLabelsParam,
    sortDataParam,
    chartBorderParam,
    chartBackgroundParam,
    textSizeParam,
    fontStyleParam,
    showLegendParam,
    legendPositionParam,
    barChartStyleParam,
    headlineNumberParam,
    startFromZeroParam,
    useCurvedLinesParam,
    animateChartsParam,
    setVisualizationType,
    setColorPalette,
    setIs3DEnabled,
    setShowDataLabels,
    setSortData,
    setChartBorder,
    setChartBackground,
    setTextSize,
    setFontStyle,
    setShowLegend,
    setLegendPosition,
    setBarChartStyle,
    setHeadlineNumber,
    setStartFromZero,
    setUseCurvedLines,
    setAnimateCharts,
    mounted,
  ])

  useEffect(() => {
    if (!username) {
      setError("No username provided")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const userData = await getUser(username)

        if (!userData) {
          throw new Error("Invalid user data received")
        }

        setUser(userData)
        setError(null)
      } catch (err) {
        setError(`Failed to fetch user data: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [username])

  if (loading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-4">
        <Card className="border border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="text-destructive">{error || "Failed to load user data"}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4">
      <Card
        className={`
        border-0 shadow-none 
        ${chartBackground === "transparent" ? "bg-transparent" : "bg-card/50"}
        ${chartBorder === "gradient" ? "chart-border-gradient" : ""}
        ${chartBorder === "solid" ? "chart-border-solid" : ""}
      `}
      >
        <CardContent className="px-0 pt-0">
          <div className="flex items-center gap-2">
            <img
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.login}
              className="h-10 w-10 rounded-full border border-border/50"
            />
            <div>
              <h3 className="font-semibold">{user.name || user.login}</h3>
              <Link
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary"
              >
                @{user.login}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardContent>
        <CardContent className="px-0 pb-0">
          <ContributionGraph username={username} height={300} />
          <div className="mt-2 text-xs text-right text-muted-foreground">
            <Link
              href={`https://${typeof window !== "undefined" ? window.location.host : "commitcanvas.vercel.app"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Powered by CommitCanvas
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


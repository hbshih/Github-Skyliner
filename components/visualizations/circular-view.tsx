"use client"

import { useRef, useEffect } from "react"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"

interface CircularViewProps {
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

export function CircularView({
  contributions,
  height = 400,
  showDataLabels = false,
  showGridLines = true,
  showLegend = true,
  is3DEnabled = false,
  animate = true,
  border = "none",
  background = "solid",
}: CircularViewProps) {
  const { getContributionColor } = useVisualization()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate max contribution for scaling
  const maxContribution = Math.max(...contributions.map((day) => day.count || 0), 1)

  // Apply border and background styles
  const containerClasses = `
    relative overflow-hidden rounded-md
    ${border === "solid" ? "border border-border" : ""}
    ${border === "gradient" ? "chart-border-gradient" : ""}
    ${background === "transparent" ? "bg-transparent" : ""}
  `

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const container = containerRef.current
    if (!container) return

    // Set canvas dimensions
    canvas.width = container.clientWidth
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate center and radius
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = Math.min(centerX, centerY) * 0.8

    // Group contributions by month (12 segments)
    const monthlyData = Array(12)
      .fill(0)
      .map(() => ({ count: 0, days: 0 }))

    contributions.forEach((day) => {
      if (!day.date) return
      const date = new Date(day.date)
      const month = date.getMonth()
      monthlyData[month].count += day.count || 0
      monthlyData[month].days++
    })

    // Draw circular segments
    const segmentAngle = (Math.PI * 2) / 12

    monthlyData.forEach((data, i) => {
      const startAngle = i * segmentAngle - Math.PI / 2
      const endAngle = startAngle + segmentAngle

      // Calculate intensity level (0-4)
      const avgContribution = data.days > 0 ? data.count / data.days : 0
      const level = Math.min(4, Math.floor((avgContribution / maxContribution) * 5))

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, maxRadius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = getContributionColor(level)
      ctx.fill()

      if (showGridLines) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Add month label if data labels are enabled
      if (showDataLabels) {
        const labelRadius = maxRadius * 1.1
        const labelAngle = startAngle + segmentAngle / 2
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.fillStyle = "#fff"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        ctx.fillText(monthNames[i], labelX, labelY)

        // Contribution count
        if (data.count > 0) {
          const countX = centerX + Math.cos(labelAngle) * (maxRadius * 0.7)
          const countY = centerY + Math.sin(labelAngle) * (maxRadius * 0.7)
          ctx.fillText(data.count.toString(), countX, countY)
        }
      }
    })

    // Draw inner circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, maxRadius * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.fill()

    // Draw total contributions in center
    const totalContributions = contributions.reduce((sum, day) => sum + (day.count || 0), 0)
    ctx.fillStyle = "#fff"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(totalContributions.toString(), centerX, centerY - 10)
    ctx.font = "12px sans-serif"
    ctx.fillText("contributions", centerX, centerY + 10)

    // Draw legend if enabled
    if (showLegend) {
      const legendX = canvas.width - 120
      const legendY = canvas.height - 80

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(legendX - 10, legendY - 10, 110, 70)

      ctx.fillStyle = "#fff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Intensity:", legendX, legendY + 5)

      for (let i = 0; i < 5; i++) {
        const y = legendY + 20 + i * 15

        ctx.fillStyle = getContributionColor(i)
        ctx.fillRect(legendX, y, 10, 10)

        ctx.fillStyle = "#fff"
        ctx.textAlign = "left"
        ctx.fillText(i === 0 ? "None" : `Level ${i}`, legendX + 15, y + 8)
      }
    }

    // Animation
    if (animate) {
      let frame = 0
      const animateCircle = () => {
        frame++

        // Pulse effect
        if (frame % 60 === 0) {
          ctx.globalAlpha = 0.3
          ctx.beginPath()
          ctx.arc(centerX, centerY, maxRadius * (1 + Math.sin(frame * 0.01) * 0.05), 0, Math.PI * 2)
          ctx.fillStyle = "#fff"
          ctx.fill()
          ctx.globalAlpha = 1.0
        }

        requestAnimationFrame(animateCircle)
      }

      requestAnimationFrame(animateCircle)
    }
  }, [contributions, height, getContributionColor, showDataLabels, showGridLines, showLegend, animate, maxContribution])

  return (
    <div ref={containerRef} className={containerClasses} style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}


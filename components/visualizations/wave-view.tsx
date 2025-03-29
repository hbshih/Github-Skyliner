"use client"

import { useRef, useEffect } from "react"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"

interface WaveViewProps {
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

export function WaveView({
  contributions,
  height = 400,
  showDataLabels = false,
  showGridLines = true,
  showLegend = true,
  is3DEnabled = false,
  animate = true,
  border = "none",
  background = "solid",
}: WaveViewProps) {
  const { getContributionColor } = useVisualization()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

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

    // Group contributions by week
    const weeklyData: number[] = []
    let currentWeek: number[] = []

    contributions.forEach((day, index) => {
      currentWeek.push(day.count || 0)

      if (currentWeek.length === 7 || index === contributions.length - 1) {
        // Calculate weekly average
        const weekSum = currentWeek.reduce((sum, count) => sum + count, 0)
        weeklyData.push(weekSum)
        currentWeek = []
      }
    })

    // Animation variables
    let offset = 0

    const drawWave = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background grid if enabled
      if (showGridLines) {
        const gridSize = 20
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1

        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      // Calculate wave parameters
      const waveWidth = canvas.width
      const waveHeight = canvas.height * 0.8
      const baseY = canvas.height * 0.9

      // Draw multiple wave layers
      const drawWaveLayer = (
        data: number[],
        amplitude: number,
        frequency: number,
        speed: number,
        color: string,
        fill: boolean,
      ) => {
        ctx.beginPath()
        ctx.moveTo(0, baseY)

        for (let x = 0; x < waveWidth; x++) {
          const dataIndex = Math.floor((x / waveWidth) * data.length)
          const normalizedValue = data[dataIndex] / maxContribution

          // Calculate y position with sine wave
          const y =
            baseY - normalizedValue * amplitude - Math.sin((x * frequency + offset * speed) / 100) * amplitude * 0.3

          ctx.lineTo(x, y)
        }

        if (fill) {
          ctx.lineTo(waveWidth, baseY)
          ctx.lineTo(0, baseY)
          ctx.fillStyle = color
          ctx.fill()
        } else {
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      // Draw multiple wave layers with different parameters
      const colors = [1, 2, 3, 4].map((level) => getContributionColor(level))

      drawWaveLayer(weeklyData, waveHeight * 0.7, 1.0, 1.0, colors[0] + "40", true)
      drawWaveLayer(weeklyData, waveHeight * 0.6, 1.2, 0.8, colors[1] + "60", true)
      drawWaveLayer(weeklyData, waveHeight * 0.5, 1.5, 0.6, colors[2] + "80", true)
      drawWaveLayer(weeklyData, waveHeight * 0.4, 2.0, 0.4, colors[3], false)

      // Draw data points if enabled
      if (showDataLabels) {
        ctx.fillStyle = "#fff"
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
        ctx.lineWidth = 1

        weeklyData.forEach((value, index) => {
          const x = (index / weeklyData.length) * waveWidth
          const normalizedValue = value / maxContribution
          const y = baseY - normalizedValue * waveHeight * 0.4

          if (value > 0) {
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()

            // Add value label
            ctx.font = "10px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText(value.toString(), x, y - 10)
          }
        })
      }

      // Draw legend if enabled
      if (showLegend) {
        const legendX = canvas.width - 120
        const legendY = 20

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(legendX - 10, legendY - 10, 110, 70)

        ctx.fillStyle = "#fff"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText("Contribution Waves", legendX, legendY + 5)

        for (let i = 0; i < 4; i++) {
          const y = legendY + 20 + i * 15

          ctx.fillStyle = colors[i]
          ctx.fillRect(legendX, y, 10, 10)

          ctx.fillStyle = "#fff"
          ctx.textAlign = "left"
          ctx.fillText(`Wave ${i + 1}`, legendX + 15, y + 8)
        }
      }

      // Animate if enabled
      if (animate) {
        offset += 1
        animationRef.current = requestAnimationFrame(drawWave)
      }
    }

    drawWave()

    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [contributions, height, getContributionColor, showDataLabels, showGridLines, showLegend, animate, maxContribution])

  return (
    <div ref={containerRef} className={containerClasses} style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}


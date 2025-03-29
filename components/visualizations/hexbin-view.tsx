"use client"

import { useRef, useEffect } from "react"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"

interface HexbinViewProps {
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

export function HexbinView({
  contributions,
  height = 400,
  showDataLabels = false,
  showGridLines = true,
  showLegend = true,
  is3DEnabled = false,
  animate = true,
  border = "none",
  background = "solid",
}: HexbinViewProps) {
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

    // Function to draw a hexagon
    const drawHexagon = (x: number, y: number, size: number, level: number) => {
      const color = getContributionColor(level)
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const hx = x + size * Math.cos(angle)
        const hy = y + size * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(hx, hy)
        } else {
          ctx.lineTo(hx, hy)
        }
      }
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()

      if (showGridLines) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      if (showDataLabels && level > 0) {
        const count = contributions.find((c) => c.level === level)?.count || 0
        if (count > 0) {
          ctx.fillStyle = "#fff"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(count.toString(), x, y)
        }
      }
    }

    // Calculate hexagon size and spacing
    const hexSize = Math.min(15, canvas.width / (Math.sqrt(contributions.length) * 2))
    const hexSpacing = hexSize * 1.8
    const startX = canvas.width / 2 - (Math.sqrt(contributions.length) * hexSpacing) / 2
    const startY = canvas.height / 2 - (Math.sqrt(contributions.length) * hexSpacing) / 2

    // Draw hexagons in a grid pattern
    let row = 0
    let col = 0
    const maxCols = Math.ceil(Math.sqrt(contributions.length))

    contributions.forEach((day, index) => {
      if (col >= maxCols) {
        col = 0
        row++
      }

      // Calculate position with offset for even rows
      const offsetX = row % 2 === 0 ? 0 : hexSpacing / 2
      const x = startX + col * hexSpacing + offsetX
      const y = startY + row * hexSpacing * 0.85

      // Draw hexagon
      drawHexagon(x, y, hexSize, day.level || 0)

      col++
    })

    // Draw legend if enabled
    if (showLegend) {
      const legendX = canvas.width - 120
      const legendY = canvas.height - 80
      const legendSize = 10

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(legendX - 10, legendY - 10, 110, 70)

      ctx.fillStyle = "#fff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Contributions:", legendX, legendY + 5)

      for (let i = 0; i < 5; i++) {
        const y = legendY + 20 + i * 15
        drawHexagon(legendX + 5, y, legendSize / 2, i)

        ctx.fillStyle = "#fff"
        ctx.textAlign = "left"
        ctx.fillText(i === 0 ? "None" : `Level ${i}`, legendX + 15, y + 3)
      }
    }

    // Animation
    if (animate) {
      let frame = 0
      const animate = () => {
        frame++
        if (frame % 60 === 0) {
          // Pulse effect every second
          contributions.forEach((day, index) => {
            if (day.level > 0 && index % 5 === frame % 5) {
              if (col >= maxCols) {
                col = 0
                row++
              }

              const r = Math.floor(index / maxCols)
              const c = index % maxCols

              const offsetX = r % 2 === 0 ? 0 : hexSpacing / 2
              const x = startX + c * hexSpacing + offsetX
              const y = startY + r * hexSpacing * 0.85

              // Pulse effect
              ctx.globalAlpha = 0.7
              drawHexagon(x, y, hexSize * 1.2, day.level)
              ctx.globalAlpha = 1.0
            }
          })
        }
        requestAnimationFrame(animate)
      }

      if (animate) {
        requestAnimationFrame(animate)
      }
    }
  }, [contributions, height, getContributionColor, showDataLabels, showGridLines, showLegend, animate, maxContribution])

  return (
    <div ref={containerRef} className={containerClasses} style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}


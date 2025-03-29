"use client"

import type React from "react"

import { BarChart3, LineChart, Calendar, Grid3X3, CuboidIcon as Cube, Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVisualization, type VisualizationType, type ColorPalette } from "@/contexts/visualization-context"
import { useState, useEffect } from "react"
import { Settings } from "lucide-react"

export function VisualizationSettings() {
  const [mounted, setMounted] = useState(false)

  // Only render after component has mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const { visualizationType, setVisualizationType, colorPalette, setColorPalette, is3DEnabled, setIs3DEnabled } =
    useVisualization()

  const visualizationTypes: { value: VisualizationType; label: string; icon: React.ReactNode }[] = [
    {
      value: "skyline",
      label: "Skyline",
      icon: <Mountain className="h-4 w-4" />,
    },
    {
      value: "calendar",
      label: "Calendar",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      value: "bar",
      label: "Bar Chart",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      value: "line",
      label: "Line Chart",
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      value: "heatmap",
      label: "Heatmap",
      icon: <Grid3X3 className="h-4 w-4" />,
    },
    {
      value: "3d-bar",
      label: "3D Bar",
      icon: <Cube className="h-4 w-4" />,
    },
  ]

  const colorPalettes: { value: ColorPalette; label: string; description: string }[] = [
    { value: "default", label: "Red (Default)", description: "Classic red theme" },
    { value: "github", label: "GitHub Green", description: "Original GitHub style" },
    { value: "neon", label: "Neon Blue", description: "Bright blue neon glow" },
    { value: "pastel", label: "Pastel Rainbow", description: "Soft pastel colors" },
    { value: "monochrome", label: "Monochrome", description: "Grayscale elegance" },
    { value: "cyberpunk", label: "Cyberpunk", description: "Futuristic neon style" },
    { value: "gradient", label: "Purple Gradient", description: "Smooth purple transitions" },
    { value: "holographic", label: "Holographic", description: "Shimmering holographic effect" },
    { value: "sunset", label: "Sunset", description: "Warm sunset colors" },
    { value: "ocean", label: "Ocean Depths", description: "Deep blue ocean tones" },
  ]

  // Don't render until client-side to avoid hydration issues
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="h-8 gap-1 border-border/50">
        <Settings className="h-4 w-4" />
        <span className="sr-only">Visualization settings</span>
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-sm font-medium">Visualization</h3>
    </div>
  )
}


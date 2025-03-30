"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ContributionDay } from "@/app/actions/github"

// Define the available visualization types
export type VisualizationType = "skyline" | "calendar"

// Define the available color palettes
export type ColorPalette =
  | "default"
  | "github"
  | "neon"
  | "pastel"
  | "monochrome"
  | "cyberpunk"
  | "gradient"
  | "holographic"
  | "sunset"
  | "ocean"
  | "synthwave"
  | "aurora"
  | "cosmic"
  | "emerald"
  | "ruby"
  | "sapphire"

// Color palette definitions
export const COLOR_PALETTES: Record<ColorPalette, string[]> = {
  default: ["#121212", "#ff3b30", "#ff6b61", "#ff9c92", "#ffcdc8"], // Red theme
  github: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"], // GitHub green
  neon: ["#121212", "#00ffff", "#00ccff", "#0099ff", "#0066ff"], // Neon blue
  pastel: ["#f0f0f0", "#ffb5b5", "#ffd6a5", "#fdffb6", "#caffbf"], // Pastel rainbow
  monochrome: ["#121212", "#2a2a2a", "#4a4a4a", "#6a6a6a", "#8a8a8a"], // Grayscale
  cyberpunk: ["#0d0221", "#ff2975", "#f222ff", "#8c1eff", "#ffd319"], // Cyberpunk
  gradient: ["#121212", "#7928ca", "#8a3ebd", "#9c55af", "#ad6ba2"], // Purple gradient
  holographic: ["#121212", "#83eaf1", "#63a4ff", "#9d63ff", "#db49d8"], // Holographic
  sunset: ["#121212", "#ff7e5f", "#feb47b", "#ffcda5", "#ffd8be"], // Sunset
  ocean: ["#121212", "#006992", "#27476e", "#001d4a", "#0a1128"], // Ocean depths
  synthwave: ["#120038", "#ff00ff", "#00ffff", "#fc199a", "#61ffca"], // Synthwave
  aurora: ["#121212", "#00ff87", "#60efff", "#0061ff", "#0f1f61"], // Northern lights
  cosmic: ["#121212", "#3a0ca3", "#4361ee", "#4cc9f0", "#7209b7"], // Deep space
  emerald: ["#121212", "#004b23", "#006400", "#007200", "#008000"], // Emerald
  ruby: ["#121212", "#590d22", "#800f2f", "#a4133c", "#c9184a"], // Ruby
  sapphire: ["#121212", "#03045e", "#023e8a", "#0077b6", "#0096c7"], // Sapphire
}

// Define the context type
interface VisualizationContextType {
  visualizationType: VisualizationType
  setVisualizationType: (type: VisualizationType) => void
  colorPalette: ColorPalette
  setColorPalette: (palette: ColorPalette) => void
  getContributionColor: (level: number) => string
  applyColorPalette: () => void

  showLegend: boolean
  setShowLegend: (show: boolean) => void
  animateCharts: boolean
  setAnimateCharts: (animate: boolean) => void
  // Skyline specific options
  skylineBuildingStyle: string
  setSkylineBuildingStyle: (style: string) => void
  skylineEnvironment: string
  setSkylineEnvironment: (environment: string) => void
  skylineReflections: boolean
  setSkylineReflections: (enabled: boolean) => void
  skylineParticles: boolean
  setSkylineParticles: (enabled: boolean) => void
  skylineRotationSpeed: number
  setSkylineRotationSpeed: (speed: number) => void
  // Contributions data
  contributions: ContributionDay[]
  setContributions: (data: ContributionDay[]) => void
}

// Create the context with default values
const VisualizationContext = createContext<VisualizationContextType>({
  visualizationType: "skyline",
  setVisualizationType: () => {},
  colorPalette: "default",
  setColorPalette: () => {},
  getContributionColor: () => "",
  applyColorPalette: () => {},

  showLegend: true,
  setShowLegend: () => {},
  animateCharts: true,
  setAnimateCharts: () => {},
  // Skyline specific options
  skylineBuildingStyle: "modern",
  setSkylineBuildingStyle: () => {},
  skylineEnvironment: "city",
  setSkylineEnvironment: () => {},
  skylineReflections: true,
  setSkylineReflections: () => {},
  skylineParticles: true,
  setSkylineParticles: () => {},
  skylineRotationSpeed: 0.5,
  setSkylineRotationSpeed: () => {},
  // Contributions data
  contributions: [],
  setContributions: () => {},
})

// Provider component
export function VisualizationProvider({ children }: { children: ReactNode }) {
  const [visualizationType, setVisualizationType] = useState<VisualizationType>("skyline")
  const [colorPalette, setColorPalette] = useState<ColorPalette>("default")
  const [isClient, setIsClient] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [animateCharts, setAnimateCharts] = useState(true)
  const [contributions, setContributions] = useState<ContributionDay[]>([])

  // Skyline specific options
  const [skylineBuildingStyle, setSkylineBuildingStyle] = useState("modern")
  const [skylineEnvironment, setSkylineEnvironment] = useState("city")
  const [skylineReflections, setSkylineReflections] = useState(true)
  const [skylineParticles, setSkylineParticles] = useState(true)
  const [skylineRotationSpeed, setSkylineRotationSpeed] = useState(0.5)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get color for a specific contribution level (0-4)
  const getContributionColor = (level: number): string => {
    // Ensure we have a valid palette and level
    const palette = COLOR_PALETTES[colorPalette] || COLOR_PALETTES.default
    return palette[level] || palette[0]
  }

  // Apply the selected color palette to CSS variables
  const applyColorPalette = () => {
    if (typeof document === "undefined") return // Guard against server-side rendering

    const colors = COLOR_PALETTES[colorPalette] || COLOR_PALETTES.default
    document.documentElement.style.setProperty("--contribution-level-0", colors[0])
    document.documentElement.style.setProperty("--contribution-level-1", colors[1])
    document.documentElement.style.setProperty("--contribution-level-2", colors[2])
    document.documentElement.style.setProperty("--contribution-level-3", colors[3])
    document.documentElement.style.setProperty("--contribution-level-4", colors[4])

    // Set chart colors based on the palette
    document.documentElement.style.setProperty("--chart-1", colors[1])
    document.documentElement.style.setProperty("--chart-2", colors[2])
    document.documentElement.style.setProperty("--chart-3", colors[3])
    document.documentElement.style.setProperty("--chart-4", colors[4])

    // Set gradient colors for holographic and gradient palettes
    if (colorPalette === "holographic" || colorPalette === "gradient") {
      document.documentElement.style.setProperty(
        "--contribution-gradient",
        `linear-gradient(135deg, ${colors[1]}, ${colors[2]}, ${colors[3]}, ${colors[4]})`,
      )
    } else {
      document.documentElement.style.setProperty(
        "--contribution-gradient",
        `linear-gradient(135deg, ${colors[1]}, ${colors[4]})`,
      )
    }
  }

  // Apply color palette when it changes
  useEffect(() => {
    if (!isClient) return // Skip during SSR

    applyColorPalette()

    // Save preferences to localStorage
    try {
      localStorage.setItem("visualization-type", visualizationType)
      localStorage.setItem("color-palette", colorPalette)

      localStorage.setItem("show-legend", showLegend.toString())
      localStorage.setItem("animate-charts", animateCharts.toString())

      // Skyline specific options
      localStorage.setItem("skyline-building-style", skylineBuildingStyle)
      localStorage.setItem("skyline-environment", skylineEnvironment)
      localStorage.setItem("skyline-reflections", skylineReflections.toString())
      localStorage.setItem("skyline-particles", skylineParticles.toString())
      localStorage.setItem("skyline-rotation-speed", skylineRotationSpeed.toString())
    } catch (error) {
      console.error("Failed to save visualization preferences:", error)
    }
  }, [
    colorPalette,
    visualizationType,
    isClient,
    showLegend,
    animateCharts,
    skylineBuildingStyle,
    skylineEnvironment,
    skylineReflections,
    skylineParticles,
    skylineRotationSpeed,
  ])

  // Load saved preferences on mount
  useEffect(() => {
    if (!isClient) return // Skip during SSR

    try {
      const savedType = localStorage.getItem("visualization-type") as VisualizationType | null
      const savedPalette = localStorage.getItem("color-palette") as ColorPalette | null

      if (savedType && ["skyline", "calendar"].includes(savedType)) {
        setVisualizationType(savedType)
      }


      const savedShowLegend = localStorage.getItem("show-legend")
      const savedAnimateCharts = localStorage.getItem("animate-charts")

      // Skyline specific options
      const savedSkylineBuildingStyle = localStorage.getItem("skyline-building-style")
      const savedSkylineEnvironment = localStorage.getItem("skyline-environment")
      const savedSkylineReflections = localStorage.getItem("skyline-reflections")
      const savedSkylineParticles = localStorage.getItem("skyline-particles")
      const savedSkylineRotationSpeed = localStorage.getItem("skyline-rotation-speed")



      if (savedShowLegend !== null) {
        setShowLegend(savedShowLegend === "true")
      }

      if (savedAnimateCharts !== null) {
        setAnimateCharts(savedAnimateCharts === "true")
      }

      // Skyline specific options
      if (savedSkylineBuildingStyle) {
        setSkylineBuildingStyle(savedSkylineBuildingStyle)
      }
      
      if (savedSkylineEnvironment) {
        setSkylineEnvironment(savedSkylineEnvironment)
      }

      if (savedSkylineReflections !== null) {
        setSkylineReflections(savedSkylineReflections === "true")
      }

      if (savedSkylineParticles !== null) {
        setSkylineParticles(savedSkylineParticles === "true")
      }

      if (savedSkylineRotationSpeed !== null) {
        setSkylineRotationSpeed(Number.parseFloat(savedSkylineRotationSpeed))
      }
    } catch (error) {
      console.error("Failed to load visualization preferences:", error)
    }
  }, [isClient])

  // Update the provider value to include the new cityStyle option
  return (
    <VisualizationContext.Provider
      value={{
        visualizationType,
        setVisualizationType,
        colorPalette,
        setColorPalette,
        getContributionColor,
        applyColorPalette,

        showLegend,
        setShowLegend,
        animateCharts,
        setAnimateCharts,
        // Skyline specific options
        skylineBuildingStyle,
        setSkylineBuildingStyle,
        skylineEnvironment,
        setSkylineEnvironment,
        skylineReflections,
        setSkylineReflections,
        skylineParticles,
        setSkylineParticles,
        skylineRotationSpeed,
        setSkylineRotationSpeed,
        // Contributions data
        contributions,
        setContributions,
      }}
    >
      {children}
    </VisualizationContext.Provider>
  )
}

// Custom hook to use the visualization context
export function useVisualization() {
  const context = useContext(VisualizationContext)
  if (context === undefined) {
    throw new Error("useVisualization must be used within a VisualizationProvider")
  }
  return context
}


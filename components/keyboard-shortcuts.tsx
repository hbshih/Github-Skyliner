"use client"

import { useEffect, useState } from "react"
import { Command } from "lucide-react"
import { useVisualization } from "@/contexts/visualization-context"

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)
  const { setVisualizationType, setSkylineBuildingStyle, setSkylineEnvironment } = useVisualization()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Show/hide help with ?
      if (e.key === "?") {
        setShowHelp((prev) => !prev)
        return
      }

      // Handle visualization type shortcuts
      if (e.key === "1") {
        setVisualizationType("skyline")
      } else if (e.key === "2") {
        setVisualizationType("calendar")
      }

      // Handle environment shortcuts
      if (e.key === "d") {
        setSkylineEnvironment("city")
      } else if (e.key === "n") {
        setSkylineEnvironment("night")
      } else if (e.key === "s") {
        setSkylineEnvironment("sunset")
      }

      // Handle building style shortcuts
      if (e.key === "m") {
        setSkylineBuildingStyle("modern")
      } else if (e.key === "f") {
        setSkylineBuildingStyle("futuristic")
      } else if (e.key === "c") {
        setSkylineBuildingStyle("classic")
      }

      // Handle additional building style shortcuts
      if (e.key === "p") {
        setSkylineBuildingStyle("pixel")
      } else if (e.key === "k") {
        setSkylineBuildingStyle("skyscraper")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setVisualizationType, setSkylineBuildingStyle, setSkylineEnvironment])

  if (!showHelp) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-4 max-w-xs animate-in-right">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Command className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Keyboard Shortcuts</h3>
        </div>
        <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground text-xs">
          Close
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <h4 className="font-medium text-primary mb-1">Visualization Type</h4>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>Skyline View</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">1</kbd>
            </li>
            <li className="flex justify-between">
              <span>Calendar View</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">2</kbd>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-1">Environment</h4>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>City</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">d</kbd>
            </li>
            <li className="flex justify-between">
              <span>Night</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">n</kbd>
            </li>
            <li className="flex justify-between">
              <span>Sunset</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">s</kbd>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-1">Building Style</h4>
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>Modern</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">m</kbd>
            </li>
            <li className="flex justify-between">
              <span>Pixel</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">p</kbd>
            </li>
            <li className="flex justify-between">
              <span>Skyscraper</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">k</kbd>
            </li>
            <li className="flex justify-between">
              <span>Futuristic</span>
              <kbd className="px-2 py-0.5 bg-secondary rounded text-muted-foreground">u</kbd>
            </li>
          </ul>
        </div>

        <div className="pt-1 border-t border-border/50">
          <p className="text-muted-foreground">
            Press <kbd className="px-1 bg-secondary rounded">?</kbd> to toggle this help panel
          </p>
        </div>
      </div>
    </div>
  )
}


"use client"

import React from "react"

// Create a simplified provider that doesn't use next-themes at all
export function FixedThemeProvider({ children }: { children: React.ReactNode }) {
  // Apply dark theme directly via useEffect to avoid hydration mismatch
  React.useEffect(() => {
    document.documentElement.classList.add("dark")
    document.documentElement.style.colorScheme = "dark"
  }, [])

  return children
}

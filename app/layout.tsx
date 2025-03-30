import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { FixedThemeProvider } from "@/components/fixed-theme-provider"
import { VisualizationProvider } from "@/contexts/visualization-context"

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Load JetBrains Mono for code elements
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "CommitCanvas - Transform Your GitHub Contributions into Art",
  description:
    "Turn your GitHub activity into stunning 3D skylines and interactive visualizations you can share anywhere.",
  keywords: ["github", "contributions", "visualization", "3D", "skyline", "developer", "portfolio"],
  authors: [{ name: "CommitCanvas" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://commitcanvas.vercel.app",
    title: "CommitCanvas - Transform Your GitHub Contributions into Art",
    description:
      "Turn your GitHub activity into stunning 3D skylines and interactive visualizations you can share anywhere.",
    siteName: "CommitCanvas",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommitCanvas - Transform Your GitHub Contributions into Art",
    description:
      "Turn your GitHub activity into stunning 3D skylines and interactive visualizations you can share anywhere.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <FixedThemeProvider>
          <VisualizationProvider>{children}</VisualizationProvider>
        </FixedThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
"use client"

import type React from "react"

// Add the useState hook to the import
import { useState } from "react"
import { ArrowRight, Github } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GithubDemo } from "@/components/github-demo"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    
    if (username) {
      setIsLoading(true)
      window.location.href = `/profile?username=${encodeURIComponent(username)}`
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Github className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display">CommitCanvas</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Github className="size-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Hero Section with enhanced visuals */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-purple-500/10 z-0"></div>

        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 z-0"></div>

        <div className="container px-4 md:px-6 z-10 py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4 animate-fade-in shadow-sm hover-scale">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Visualize your GitHub activity in 3D
                </div>

                <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none max-w-3xl font-display">
                  Transform your GitHub{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient">
                    contributions
                  </span>{" "}
                  into stunning art
                </h1>

                <p className="max-w-[600px] text-xl text-muted-foreground md:text-2xl/relaxed">
                  CommitCanvas turns your coding activity into beautiful 3D skylines and interactive visualizations you
                  can share anywhere.
                </p>
              </div>

              <div className="flex flex-col gap-4 min-[400px]:flex-row max-w-md">
                <form className="flex-1 sm:flex-initial w-full" action="/profile" method="get" onSubmit={handleSubmit}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 group">
                      <Input
                        name="username"
                        placeholder="Enter GitHub username"
                        type="text"
                        className="h-12 pl-4 pr-12 text-base bg-secondary/80 backdrop-blur border-0 focus-visible:ring-primary shadow-lg transition-all duration-300 group-hover:shadow-xl"
                        disabled={isLoading}
                        required
                      />
                      <Github className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-all duration-300 group-hover:text-primary" />
                    </div>
                    <Button
                      type="submit"
                      className="h-12 px-6 text-base font-medium gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        <>
                          Visualize Now
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <div className="text-sm text-muted-foreground">
                  Try examples:{" "}
                  <Link
                    href="/profile?username=vercel"
                    className="text-primary hover:underline font-medium transition-colors"
                    onClick={() => setIsLoading(true)}
                  >
                    vercel
                  </Link>
                  ,{" "}
                  <Link
                    href="/profile?username=shadcn"
                    className="text-primary hover:underline font-medium transition-colors"
                    onClick={() => setIsLoading(true)}
                  >
                    shadcn
                  </Link>
                  ,{" "}
                  <Link
                    href="/profile?username=facebook"
                    className="text-primary hover:underline font-medium transition-colors"
                    onClick={() => setIsLoading(true)}
                  >
                    facebook
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {["/avatars/user1.png", "/avatars/user2.png", "/avatars/user3.png", "/avatars/user4.png"].map(
                    (avatar, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs font-medium shadow-md hover-scale transition-all duration-300"
                        style={{ zIndex: 4 - i }}
                      >
                        {i + 1}
                      </div>
                    ),
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">1,000+</span> developers visualized their contributions
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center relative">
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 blur-xl animate-pulse"></div>

              <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500 hover:shadow-primary/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500"></div>
                <GithubDemo />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40">
        <p className="text-xs text-muted-foreground">© 2024 CommitCanvas. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}


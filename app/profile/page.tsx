"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ContributionGraph } from "@/components/contribution-graph"
import { LanguageChart } from "@/components/language-chart"
import { RepoList } from "@/components/repo-list"
import { ProfileHeader } from "@/components/profile-header"
import { getUser, type GitHubUser } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"
import { CustomizationPanel } from "@/components/customization-panel"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { ConfettiEffect } from "@/components/confetti-effect"
import { TransitionLoading } from "@/components/transition-loading"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const username = searchParams?.get("username") || ""
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { visualizationType } = useVisualization()

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
        setUser(userData)
        setError(null)

        // Add success toast
        toast({
          title: "Profile loaded!",
          description: `Successfully loaded ${userData.name || userData.login}'s GitHub profile`,
        })
      } catch (err) {
        setError(`Failed to fetch user data: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [username, toast])

  if (loading) {
    return <TransitionLoading username={username} />
  }

  if (error || !user) {
    return (
      <div className="container py-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <Card className="border border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Failed to load user data"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Try Another Username</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="container py-10 gradient-bg">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <ProfileHeader user={user} />
          </div>

          <Card className="border border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Contribution Activity</CardTitle>
              <CardDescription>
                Visualization of {user.name || user.login}'s GitHub contributions over the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div id="visualization-container" className="w-full">
                <ContributionGraph username={username} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="border border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>
                  Programming languages used across {user.name || user.login}'s repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LanguageChart username={username} />
              </CardContent>
            </Card>

            <Card className="border border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Top Repositories</CardTitle>
                <CardDescription>{user.name || user.login}'s most popular public repositories</CardDescription>
              </CardHeader>
              <CardContent>
                <RepoList username={username} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Customization Panel - Always visible */}
      <CustomizationPanel username={username} />
      <KeyboardShortcuts />
      <ConfettiEffect />
    </div>
  )
}


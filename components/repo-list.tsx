"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ExternalLink, GitFork, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getRepos, type GitHubRepo } from "@/app/actions/github"

interface RepoListProps {
  username: string
}

export function RepoList({ username }: RepoListProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const data = await getRepos(username)

        // Sort by stars (descending)
        const sortedRepos = [...data].sort((a, b) => b.stargazers_count - a.stargazers_count)

        // Take top 10 repos
        setRepos(sortedRepos.slice(0, 10))
        setError(null)
      } catch (err) {
        setError(`Failed to fetch repository data: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchData()
    }
  }, [username])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4 mt-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  // Language colors mapping
  const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    "C++": "#f34b7d",
    PHP: "#4F5D95",
    Ruby: "#701516",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    "C#": "#178600",
    Shell: "#89e051",
    Vue: "#41b883",
    Jupyter: "#DA5B0B",
    Markdown: "#083fa1",
    SCSS: "#c6538c",
  }

  return (
    <div className="space-y-6">
      {repos.map((repo) => (
        <div key={repo.id} className="space-y-2 p-4 rounded-lg border border-border/50 bg-secondary">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{repo.name}</h3>
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="sr-only">View repository</span>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">{repo.description || "No description provided"}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {repo.language && (
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#858585" }}
                />
                {repo.language}
              </div>
            )}

            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {repo.stargazers_count.toLocaleString()}
            </div>

            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {repo.forks_count.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


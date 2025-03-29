"use server"

import { cache } from "react"

// Types for GitHub API responses
export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  html_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
  company?: string
  location?: string
  blog?: string
  twitter_username?: string
  email?: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  created_at: string
  updated_at: string
  topics: string[]
  visibility: string
}

export interface ContributionDay {
  date: string
  count: number
  level: number
}

export interface LanguageStat {
  name: string
  percentage: number
  color: string
  size: number
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

// Helper function to make authenticated GitHub API requests
async function fetchGitHub(endpoint: string) {
  const token = process.env.GITHUB_ACCESS_TOKEN

  if (!token) {
    throw new Error("GitHub token not configured")
  }

  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

// Helper function to make GitHub GraphQL API requests
async function fetchGitHubGraphQL(query: string, variables: Record<string, any> = {}) {
  const token = process.env.GITHUB_ACCESS_TOKEN

  if (!token) {
    throw new Error("GitHub token not configured")
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API error: ${response.status}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(`GraphQL Error: ${json.errors.map((e: any) => e.message).join(", ")}`)
  }

  return json.data
}

// Fetch user profile data
export const getUser = cache(async (username: string): Promise<GitHubUser> => {
  return fetchGitHub(`/users/${username}`)
})

// Fetch user repositories
export const getRepos = cache(async (username: string): Promise<GitHubRepo[]> => {
  const repos = await fetchGitHub(`/users/${username}/repos?sort=updated&per_page=100`)
  return repos
})

// Fetch contribution data using GraphQL API
export const getContributions = cache(
  async (
    username: string,
  ): Promise<{
    contributionDays: ContributionDay[]
    totalContributions: number
    currentStreak: number
    longestStreak: number
  }> => {
    // GraphQL query to fetch contribution calendar data
    const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `

    const data = await fetchGitHubGraphQL(query, { username })

    if (!data.user) {
      throw new Error(`User ${username} not found`)
    }

    const calendar = data.user.contributionsCollection.contributionCalendar
    const totalContributions = calendar.totalContributions

    // Flatten the weeks array into a single array of contribution days
    const contributionDays: ContributionDay[] = []

    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        contributionDays.push({
          date: day.date,
          count: day.contributionCount,
          // Convert color to level (0-4)
          level:
            day.contributionCount === 0
              ? 0
              : day.contributionCount <= 3
                ? 1
                : day.contributionCount <= 6
                  ? 2
                  : day.contributionCount <= 9
                    ? 3
                    : 4,
        })
      })
    })

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Sort by date (newest first) to calculate current streak
    const sortedDays = [...contributionDays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate current streak (consecutive days with contributions, starting from today)
    for (const day of sortedDays) {
      if (day.count > 0) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    for (const day of contributionDays) {
      if (day.count > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    return {
      contributionDays,
      totalContributions,
      currentStreak,
      longestStreak,
    }
  },
)

// Fetch language statistics
export const getLanguageStats = cache(async (username: string): Promise<LanguageStat[]> => {
  // First get user repos
  const repos = await getRepos(username)

  // For each repo, fetch languages
  const languagePromises = repos.map((repo) => fetchGitHub(`/repos/${repo.full_name}/languages`))

  const repoLanguages = await Promise.all(languagePromises)

  // Aggregate language bytes across all repos
  const languageTotals: Record<string, number> = {}
  let totalBytes = 0

  repoLanguages.forEach((languages) => {
    Object.entries(languages).forEach(([language, bytes]) => {
      languageTotals[language] = (languageTotals[language] || 0) + (bytes as number)
      totalBytes += bytes as number
    })
  })

  // Convert to percentage and format
  const languageStats: LanguageStat[] = Object.entries(languageTotals)
    .map(([name, size]) => ({
      name,
      size,
      percentage: Math.round((size / totalBytes) * 1000) / 10, // Round to 1 decimal place
      color: LANGUAGE_COLORS[name] || "#858585", // Default gray for unknown languages
    }))
    .sort((a, b) => b.size - a.size) // Sort by size (descending)
    .slice(0, 10) // Limit to top 10 languages

  return languageStats
})


"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getLanguageStats, type LanguageStat } from "@/app/actions/github"

interface LanguageChartProps {
  username: string
}

export function LanguageChart({ username }: LanguageChartProps) {
  const [languages, setLanguages] = useState<LanguageStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const data = await getLanguageStats(username)
        setLanguages(data)
        setError(null)
      } catch (err) {
        setError(`Failed to fetch language data: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchData()
    }
  }, [username])

  if (loading) {
    return <Skeleton className="w-full h-[300px]" />
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="h-6 w-full rounded-full overflow-hidden flex">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="h-full"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
            <div className="text-sm">{lang.name}</div>
            <div className="text-sm font-medium ml-auto">{lang.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}


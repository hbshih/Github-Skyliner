import Link from "next/link"
import { ExternalLink, Users, MapPin, Building, LinkIcon, Twitter } from "lucide-react"
import type { GitHubUser } from "@/app/actions/github"

interface ProfileHeaderProps {
  user: GitHubUser
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <div className="relative">
        <img
          src={user.avatar_url || "/placeholder.svg"}
          alt={user.login}
          className="w-24 h-24 rounded-full border-2 border-primary/20 shadow-lg hover-scale transition-all duration-300"
        />
        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full shadow-md">
          {user.public_repos} repos
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {user.name || user.login}
            {user.twitter_username && (
              <Link
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1DA1F2] hover:text-[#1a91da] transition-colors"
                aria-label={`${user.login}'s Twitter profile`}
              >
                <Twitter className="h-5 w-5" />
              </Link>
            )}
          </h1>
          <Link
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
          >
            @{user.login}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {user.bio && <p className="text-muted-foreground border-l-2 border-primary/20 pl-3 italic">"{user.bio}"</p>}

        <div className="flex flex-wrap gap-2 text-sm">
          {user.company && (
            <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 shadow-sm hover-scale">
              <Building className="h-4 w-4 text-primary" />
              <span>{user.company}</span>
            </div>
          )}

          {user.location && (
            <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 shadow-sm hover-scale">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{user.location}</span>
            </div>
          )}

          {user.blog && (
            <div className="flex items-center gap-1 bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 shadow-sm hover-scale">
              <LinkIcon className="h-4 w-4 text-primary" />
              <Link
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {user.blog}
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm mt-2">
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-sm hover-scale">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-primary"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <span>{user.public_repos} repositories</span>
          </div>

          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-sm hover-scale">
            <Users className="h-4 w-4 text-primary" />
            <span>{user.followers} followers</span>
          </div>

          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-sm hover-scale">
            <Users className="h-4 w-4 text-primary" />
            <span>{user.following} following</span>
          </div>
        </div>
      </div>
    </div>
  )
}


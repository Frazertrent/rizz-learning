"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Globe, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface WebsiteThumbnailProps {
  url: string
  title: string
  className?: string
}

// Helper function to safely parse URLs
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch (e) {
    return false
  }
}

function getHostname(urlString: string): string {
  try {
    const url = new URL(urlString)
    return url.hostname
  } catch (e) {
    // Return the URL string itself if it's not a valid URL
    return urlString
  }
}

export function WebsiteThumbnail({ url, title, className }: WebsiteThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Validate URL before using it
  const isUrlValid = isValidUrl(url)

  // Generate thumbnail URL using thum.io service (free, reliable)
  const thumbnailUrl = isUrlValid 
    ? `https://image.thum.io/get/width/300/crop/200/noanimate/${encodeURIComponent(url)}`
    : null

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (isUrlValid) {
      window.open(url, "_blank", "noopener,noreferrer")
      }
    },
    [url, isUrlValid],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        if (isUrlValid) {
        window.open(url, "_blank", "noopener,noreferrer")
      }
      }
    },
    [url, isUrlValid],
  )

  // If URL is invalid, show error state immediately
  if (!isUrlValid) {
    return (
      <div
        className={cn(
          "relative group rounded-lg overflow-hidden",
          "bg-gray-800 border border-gray-700",
          "transition-all duration-200 ease-in-out",
          className,
        )}
        style={{ width: "300px", height: "200px" }}
      >
        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-gray-400">
          <Globe className="w-12 h-12 mb-2 text-gray-500" />
          <span className="text-sm font-medium text-center px-4">{title}</span>
          <span className="text-xs text-gray-500 mt-1">Invalid URL</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-lg overflow-hidden",
        "bg-gray-800 border border-gray-700",
        "transition-all duration-200 ease-in-out",
        "hover:scale-105 hover:shadow-lg hover:shadow-red-500/20",
        "hover:border-red-500/50",
        "focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900",
        className,
      )}
      style={{ width: "300px", height: "200px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable overlay for accessibility */}
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 z-10 w-full h-full bg-transparent focus:outline-none"
        aria-label={`Open ${title} in new tab`}
        title={`Visit ${title}`}
      />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-8 h-8 text-gray-600 animate-pulse" />
          </div>
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-gray-400">
          <Globe className="w-12 h-12 mb-2 text-gray-500" />
          <span className="text-sm font-medium text-center px-4">{title}</span>
          <span className="text-xs text-gray-500 mt-1">Preview unavailable</span>
        </div>
      )}

      {/* Website thumbnail image */}
      {!hasError && thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={`Preview of ${title} website`}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      )}

      {/* Overlay with title and external link icon */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent",
          "transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-sm truncate pr-2">{title}</h3>
            <ExternalLink className="w-4 h-4 text-white flex-shrink-0" />
          </div>
          <p className="text-gray-300 text-xs mt-1 truncate">{getHostname(url)}</p>
        </div>
      </div>

      {/* Hover border glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-lg border-2 border-red-500/0 transition-all duration-200",
          isHovered && "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        )}
      />
    </div>
  )
}

// Usage examples component
export function WebsiteThumbnailExamples() {
  const educationalSites = [
    {
      url: "https://www.khanacademy.org",
      title: "Khan Academy",
    },
    {
      url: "https://readingeggs.com",
      title: "Reading Eggs",
    },
    {
      url: "https://www.ixl.com",
      title: "IXL Learning",
    },
    {
      url: "https://www.duolingo.com",
      title: "Duolingo",
    },
    {
      url: "https://www.codecademy.com",
      title: "Codecademy",
    },
    {
      url: "https://brilliant.org",
      title: "Brilliant",
    },
    {
      url: "https://www.coursera.org",
      title: "Coursera",
    },
    {
      url: "https://www.edx.org",
      title: "edX",
    },
  ]

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Educational Platform Thumbnails</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {educationalSites.map((site) => (
            <WebsiteThumbnail key={site.url} url={site.url} title={site.title} />
          ))}
        </div>

        {/* Single example with custom styling */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4">Custom Styled Example</h2>
          <WebsiteThumbnail
            url="https://scratch.mit.edu"
            title="Scratch Programming"
            className="mx-auto border-2 border-blue-500/30"
          />
        </div>
      </div>
    </div>
  )
}

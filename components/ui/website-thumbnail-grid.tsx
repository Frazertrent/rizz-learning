"use client"
import { WebsiteThumbnail } from "./website-thumbnail"

interface WebsiteGridItem {
  url: string
  title: string
  category?: string
}

interface WebsiteThumbnailGridProps {
  websites: WebsiteGridItem[]
  title?: string
  className?: string
  columns?: 2 | 3 | 4
}

export function WebsiteThumbnailGrid({ websites, title, className, columns = 3 }: WebsiteThumbnailGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  return (
    <div className={className}>
      {title && <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>}

      <div className={`grid ${gridCols[columns]} gap-6`}>
        {websites.map((website) => (
          <WebsiteThumbnail key={website.url} url={website.url} title={website.title} />
        ))}
      </div>
    </div>
  )
}

// Pre-configured educational website collections
export const EDUCATIONAL_WEBSITES = {
  math: [
    { url: "https://www.khanacademy.org", title: "Khan Academy", category: "Math" },
    { url: "https://www.ixl.com", title: "IXL Math", category: "Math" },
    { url: "https://brilliant.org", title: "Brilliant", category: "Math" },
    { url: "https://www.mathplayground.com", title: "Math Playground", category: "Math" },
  ],
  reading: [
    { url: "https://readingeggs.com", title: "Reading Eggs", category: "Reading" },
    { url: "https://www.raz-kids.com", title: "Raz-Kids", category: "Reading" },
    { url: "https://www.storylineonline.net", title: "Storyline Online", category: "Reading" },
    { url: "https://www.epic.com", title: "Epic Books", category: "Reading" },
  ],
  coding: [
    { url: "https://scratch.mit.edu", title: "Scratch", category: "Coding" },
    { url: "https://www.codecademy.com", title: "Codecademy", category: "Coding" },
    { url: "https://code.org", title: "Code.org", category: "Coding" },
    { url: "https://www.tynker.com", title: "Tynker", category: "Coding" },
  ],
  science: [
    { url: "https://www.nasa.gov/audience/forkids", title: "NASA Kids", category: "Science" },
    { url: "https://www.nationalgeographic.com/kids", title: "Nat Geo Kids", category: "Science" },
    { url: "https://www.brainpop.com", title: "BrainPOP", category: "Science" },
    { url: "https://www.mysteryscience.com", title: "Mystery Science", category: "Science" },
  ],
  languages: [
    { url: "https://www.duolingo.com", title: "Duolingo", category: "Languages" },
    { url: "https://www.babbel.com", title: "Babbel", category: "Languages" },
    { url: "https://www.rosettastone.com", title: "Rosetta Stone", category: "Languages" },
    { url: "https://www.busuu.com", title: "Busuu", category: "Languages" },
  ],
}

import { WebsiteThumbnailExamples, WebsiteThumbnailGrid, EDUCATIONAL_WEBSITES } from "@/components/ui/website-thumbnail"

export default function WebsiteThumbnailsDemo() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Website Thumbnail Component Demo</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interactive website previews with real thumbnails, hover effects, and accessibility features. Click any
            thumbnail to visit the website in a new tab.
          </p>
        </div>

        {/* Math websites */}
        <WebsiteThumbnailGrid websites={EDUCATIONAL_WEBSITES.math} title="Mathematics Learning Platforms" columns={4} />

        {/* Reading websites */}
        <WebsiteThumbnailGrid websites={EDUCATIONAL_WEBSITES.reading} title="Reading & Literature" columns={4} />

        {/* Coding websites */}
        <WebsiteThumbnailGrid
          websites={EDUCATIONAL_WEBSITES.coding}
          title="Programming & Computer Science"
          columns={4}
        />

        {/* Science websites */}
        <WebsiteThumbnailGrid websites={EDUCATIONAL_WEBSITES.science} title="Science & Discovery" columns={4} />

        {/* Language websites */}
        <WebsiteThumbnailGrid websites={EDUCATIONAL_WEBSITES.languages} title="Language Learning" columns={4} />

        {/* Usage examples */}
        <div className="border-t border-gray-700 pt-12">
          <WebsiteThumbnailExamples />
        </div>
      </div>
    </div>
  )
}

import { Play, Calendar, Eye } from 'lucide-react'
import SEO from './SEO'

const allVideos = [
  {
    id: 1,
    title: "Getting Started with Web Development",
    description: "A comprehensive guide for beginners starting their web development journey.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    duration: "12:34",
    views: "15K",
    date: "2025-01-03",
    category: "Tutorial"
  },
  {
    id: 2,
    title: "React Best Practices 2025",
    description: "Learn the latest best practices for building React applications in 2025.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    duration: "20:15",
    views: "32K",
    date: "2025-01-02",
    category: "React"
  },
  {
    id: 3,
    title: "Building Modern UIs with Tailwind",
    description: "Master Tailwind CSS and create beautiful, responsive user interfaces.",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    duration: "18:45",
    views: "28K",
    date: "2025-01-01",
    category: "CSS"
  },
  {
    id: 4,
    title: "TypeScript Advanced Patterns",
    description: "Deep dive into advanced TypeScript patterns and techniques.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    duration: "25:30",
    views: "18K",
    date: "2024-12-30",
    category: "TypeScript"
  },
  {
    id: 5,
    title: "Next.js 14 Full Course",
    description: "Complete guide to building full-stack applications with Next.js 14.",
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
    duration: "45:00",
    views: "42K",
    date: "2024-12-28",
    category: "Next.js"
  },
  {
    id: 6,
    title: "AWS for Developers",
    description: "Essential AWS services every developer should know.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    duration: "30:15",
    views: "25K",
    date: "2024-12-25",
    category: "Cloud"
  }
]

export default function VideosPage() {
  return (
    <>
      <SEO 
        title="Videos - ModernBlog"
        description="Watch our collection of programming tutorials and tech talks"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Video Library
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Learn through our comprehensive video tutorials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allVideos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {video.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(video.date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
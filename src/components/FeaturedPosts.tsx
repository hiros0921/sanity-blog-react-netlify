import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

const featuredPosts = [
  {
    id: 1,
    title: "The Future of AI in Web Development",
    excerpt: "Exploring how artificial intelligence is revolutionizing the way we build websites and applications.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    author: "Tech Writer",
    date: "2025-01-03",
    slug: "test-post-1"
  },
  {
    id: 2,
    title: "Mastering TypeScript in 2025",
    excerpt: "A comprehensive guide to becoming proficient in TypeScript and leveraging its full potential.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    author: "Code Expert",
    date: "2025-01-02",
    slug: "test-post-2"
  }
]

export default function FeaturedPosts() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              Featured Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our most popular and trending articles
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.slug}`}
              className="group flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="md:w-2/5 h-56 md:h-auto">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:w-3/5">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{post.author}</span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('ja-JP')}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
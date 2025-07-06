import HeroSection from './HeroSection'
import VideoSection from './VideoSection'
import FeaturedPosts from './FeaturedPosts'
import NewsletterSection from './NewsletterSection'
import SEO from './SEO'

export default function HomePage() {
  return (
    <>
      <SEO 
        title="ModernBlog - Home"
        description="Welcome to ModernBlog. Discover amazing stories and engaging videos."
      />
      <HeroSection />
      <FeaturedPosts />
      <VideoSection />
      <NewsletterSection />
    </>
  )
}
import { Github, Twitter, Linkedin, Globe } from 'lucide-react'
import SEO from './SEO'

export default function ProfilePage() {
  return (
    <>
      <SEO 
        title="Profile - ModernBlog"
        description="Learn more about the creator behind ModernBlog"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    John Doe
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                    Full Stack Developer & Content Creator
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Passionate about building beautiful web experiences and sharing knowledge through articles and videos.
                    10+ years of experience in web development.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Twitter className="w-5 h-5" />
                      <span>Twitter</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Github className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Globe className="w-5 h-5" />
                      <span>Website</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Skills & Technologies
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'Tailwind CSS'].map((skill) => (
                  <div
                    key={skill}
                    className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-center text-gray-700 dark:text-gray-300 font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Experience
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Senior Full Stack Developer
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Tech Company Inc. • 2020 - Present</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Leading development of web applications using modern technologies. Mentoring junior developers and conducting code reviews.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-600 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Content Creator
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Self-employed • 2018 - Present</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Creating educational content about web development. Published 100+ articles and 50+ video tutorials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
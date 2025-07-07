import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AdvancedSearch from './AdvancedSearch'
import CommentNotifications from './CommentNotifications'

export default function PremiumHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('dark')
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 blur-background' : 'py-4'
      }`}
    >
      <div className={`absolute inset-0 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
      }`}></div>
      
      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-black text-white font-display">
              HiroSuwa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { name: 'Home', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: 'Videos', path: '/videos' },
              { name: 'Code', path: '/code-samples' },
              { name: 'Library', path: '/library' },
              { name: 'Pricing', path: '/pricing' },
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Profile', path: '/profile' },
              { name: 'Contact', path: '/contact' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative text-gray-300 hover:text-white transition-colors duration-300 font-medium group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Advanced Search */}
            <AdvancedSearch />
            
            {/* Comment Notifications */}
            <div className="relative">
              <CommentNotifications />
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Premium CTA */}
            <Link
              to="/contact"
              className="hidden md:block px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-4 py-4">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Videos', path: '/videos' },
                  { name: 'Code', path: '/code-samples' },
                  { name: 'Library', path: '/library' },
                  { name: 'Pricing', path: '/pricing' },
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'Profile', path: '/profile' },
                  { name: 'Contact', path: '/contact' }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
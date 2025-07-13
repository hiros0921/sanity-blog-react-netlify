import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Menu, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import AdvancedSearch from './AdvancedSearch'
import CommentNotifications from './CommentNotifications'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

export default function PremiumHeader() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
              { name: t('common.home'), path: '/' },
              { name: t('common.blog'), path: '/blog' },
              { name: t('common.videos'), path: '/videos' },
              { name: t('common.code'), path: '/code-samples' },
              { name: t('common.library'), path: '/library' },
              { name: t('common.pricing'), path: '/pricing' },
              { name: t('common.dashboard'), path: '/dashboard' },
              { name: t('common.profile'), path: '/profile' },
              { name: t('common.contact'), path: '/contact' }
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
            
            {/* Language Switcher */}
            <LanguageSwitcher variant="dropdown" showLabel={false} />

            {/* Dark mode toggle */}
            <ThemeToggle variant="icon" />

            {/* Premium CTA */}
            <Link
              to="/contact"
              className="hidden md:block px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {t('navigation.getStarted')}
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
                  { name: t('common.home'), path: '/' },
                  { name: t('common.blog'), path: '/blog' },
                  { name: t('common.videos'), path: '/videos' },
                  { name: t('common.code'), path: '/code-samples' },
                  { name: t('common.library'), path: '/library' },
                  { name: t('common.pricing'), path: '/pricing' },
                  { name: t('common.dashboard'), path: '/dashboard' },
                  { name: t('common.profile'), path: '/profile' },
                  { name: t('common.contact'), path: '/contact' }
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
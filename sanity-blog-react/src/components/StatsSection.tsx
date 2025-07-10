import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { Users, FileText, Play, Award } from 'lucide-react'

const stats = [
  {
    icon: Users,
    label: 'Active Users',
    value: 50000,
    suffix: '+',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    icon: FileText,
    label: 'Articles Published',
    value: 1200,
    suffix: '+',
    color: 'from-purple-600 to-pink-600'
  },
  {
    icon: Play,
    label: 'Video Views',
    value: 2500000,
    suffix: '+',
    color: 'from-red-600 to-orange-600'
  },
  {
    icon: Award,
    label: 'Awards Won',
    value: 25,
    suffix: '',
    color: 'from-green-600 to-teal-600'
  }
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-black">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
            Numbers That Matter
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            私たちのコミュニティは日々成長し続けています
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="premium-card p-8 text-center group hover-lift"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${stat.color} p-0.5`}>
                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              
              <p className="text-gray-400 mt-2 font-medium">{stat.label}</p>
              
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
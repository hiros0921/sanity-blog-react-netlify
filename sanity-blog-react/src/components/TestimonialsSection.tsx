import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: "山田太郎",
    role: "スタートアップCEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    content: "このプラットフォームは私のビジネスを次のレベルに引き上げてくれました。最新のテクノロジートレンドを学び、実践できる最高の場所です。",
    rating: 5
  },
  {
    id: 2,
    name: "佐藤花子",
    role: "フリーランスデザイナー",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    content: "デザインとテクノロジーの融合について学べる素晴らしいコンテンツ。キャリアアップに大きく貢献しています。",
    rating: 5
  },
  {
    id: 3,
    name: "鈴木一郎",
    role: "テックリード",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    content: "実践的で質の高いコンテンツが豊富。チーム全体のスキルアップに活用させていただいています。",
    rating: 5
  }
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
            What People Say
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            私たちのコミュニティメンバーからの声
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.8,
                  display: activeIndex === index ? 'block' : 'none'
                }}
                transition={{ duration: 0.5 }}
                className="premium-card p-8 md:p-12"
              >
                <Quote className="w-16 h-16 text-purple-500 mb-6 opacity-50" />
                
                <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
                  {testimonial.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* インジケーター */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'w-12 bg-gradient-to-r from-purple-600 to-blue-600' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
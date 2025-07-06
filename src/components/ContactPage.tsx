import { useState } from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'
import SEO from './SEO'
import { useABTest } from '../lib/abTesting'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const { variant, value: formLayout, recordConversion } = useABTest({
    id: 'contact_form',
    name: 'お問い合わせフォーム',
    description: 'フォームのレイアウトとCTAを最適化',
    variants: {
      A: {
        layout: 'traditional',
        submitText: 'Send Message',
        submitIcon: true,
        fieldOrder: ['name-email', 'subject', 'message'],
        bgColor: 'bg-white dark:bg-gray-800',
        submitColor: 'bg-gradient-to-r from-blue-600 to-purple-600'
      },
      B: {
        layout: 'modern',
        submitText: 'メッセージを送信',
        submitIcon: false,
        fieldOrder: ['subject', 'message', 'name-email'],
        bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900',
        submitColor: 'bg-black dark:bg-white text-white dark:text-black'
      }
    },
    goal: 'conversion'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    recordConversion() // A/Bテストのコンバージョンを記録
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <>
      <SEO 
        title="Contact - ModernBlog"
        description="Get in touch with us"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Have a question or want to collaborate? We'd love to hear from you.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className={`${formLayout.bgColor} rounded-2xl shadow-xl p-8`}>
                {formLayout.fieldOrder.map((field) => {
                  if (field === 'name-email') {
                    return (
                      <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {variant === 'B' ? 'お名前' : 'Your Name'}
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {variant === 'B' ? 'メールアドレス' : 'Email Address'}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                          />
                        </div>
                      </div>
                    )
                  }
                  
                  if (field === 'subject') {
                    return (
                      <div key={field} className="mb-6">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {variant === 'B' ? '件名' : 'Subject'}
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        />
                      </div>
                    )
                  }
                  
                  if (field === 'message') {
                    return (
                      <div key={field} className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {variant === 'B' ? 'メッセージ' : 'Message'}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                        />
                      </div>
                    )
                  }
                  
                  return null
                })}

                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${formLayout.submitColor} font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
                >
                  {formLayout.submitIcon && <Send className="w-5 h-5" />}
                  {formLayout.submitText}
                </button>
              </form>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-8 rounded-2xl text-center">
                <Mail className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
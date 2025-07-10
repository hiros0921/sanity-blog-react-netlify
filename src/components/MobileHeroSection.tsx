export default function MobileHeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 text-center px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            The Future
          </span>
        </h1>
        
        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
          次世代のコンテンツプラットフォームで、あなたの可能性を解き放つ
        </p>
        
        <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
          探索を始める →
        </button>
      </div>
    </section>
  )
}
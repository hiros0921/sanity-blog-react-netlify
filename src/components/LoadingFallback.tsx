export default function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  FolderPlus,
  Globe,
  Lock,
  MoreVertical
} from 'lucide-react'
import { useBookmarks } from '../lib/bookmarks'

export default function ReadingListManager() {
  const { readingLists, bookmarks, createReadingList, updateReadingList, deleteReadingList } = useBookmarks()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingList, setEditingList] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    color: '#3B82F6',
    icon: '📚'
  })

  const handleCreate = () => {
    if (formData.name.trim()) {
      createReadingList(formData)
      setFormData({
        name: '',
        description: '',
        isPublic: false,
        color: '#3B82F6',
        icon: '📚'
      })
      setShowCreateForm(false)
    }
  }

  const handleUpdate = (listId: string) => {
    if (formData.name.trim()) {
      updateReadingList(listId, formData)
      setEditingList(null)
    }
  }

  const handleDelete = (listId: string) => {
    if (confirm('この読書リストを削除してもよろしいですか？')) {
      deleteReadingList(listId)
    }
  }

  const icons = ['📚', '📖', '📝', '🎯', '⭐', '🔖', '📌', '💡', '🎨', '🚀']
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#6B7280'
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-7 h-7" />
          読書リスト
        </h2>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FolderPlus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {/* 読書リスト一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readingLists.map(list => {
          const listBookmarks = list.bookmarkIds
            .map(id => bookmarks.find(b => b.id === id))
            .filter(Boolean)
          
          return (
            <motion.div
              key={list.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{list.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {list.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {list.isPublic ? (
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          公開
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          非公開
                        </span>
                      )}
                      <span>・</span>
                      <span>{listBookmarks.length} 件</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setEditingList(editingList === list.id ? null : list.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {editingList === list.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                      <button
                        onClick={() => {
                          setFormData({
                            name: list.name,
                            description: list.description || '',
                            isPublic: list.isPublic,
                            color: list.color || '#3B82F6',
                            icon: list.icon || '📚'
                          })
                          setEditingList(list.id)
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(list.id)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        削除
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {list.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {list.description}
                </p>
              )}

              {/* プレビュー画像 */}
              <div className="flex -space-x-2 mb-3">
                {listBookmarks.slice(0, 4).map((bookmark, i) => (
                  <div
                    key={i}
                    className="w-12 h-16 bg-gray-200 dark:bg-gray-700 rounded border-2 border-white dark:border-gray-800"
                    style={{
                      backgroundImage: bookmark?.postImage ? `url(${bookmark.postImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                ))}
                {listBookmarks.length > 4 && (
                  <div className="w-12 h-16 bg-gray-300 dark:bg-gray-600 rounded border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      +{listBookmarks.length - 4}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div
                  className="w-20 h-1 rounded-full"
                  style={{ backgroundColor: list.color || '#3B82F6' }}
                />
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  表示 →
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 作成/編集フォーム */}
      <AnimatePresence>
        {(showCreateForm || editingList) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowCreateForm(false)
                setEditingList(null)
              }}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingList ? '読書リストを編集' : '新しい読書リスト'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    名前
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="例: 技術書リスト"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    説明（任意）
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                    placeholder="このリストの説明を入力..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    アイコン
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all ${
                          formData.icon === icon
                            ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    カラー
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          formData.color === color
                            ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                    このリストを公開する
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingList(null)
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => editingList ? handleUpdate(editingList) : handleCreate()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingList ? '更新' : '作成'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
import EnhancedSEO from './EnhancedSEO'
import CodeBlock from './CodeBlock'
import { motion } from 'framer-motion'

export default function CodeDemoPage() {
  const examples = {
    react: `// React Hooks の使用例
import { useState, useEffect } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(\`/api/users/\${userId}\`)
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>User not found</div>

  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  )
}`,

    typescript: `// TypeScript ジェネリクスの例
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

class DataService<T> {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`)
    const data = await response.json()
    
    return {
      data: data as T,
      status: response.status,
      message: response.statusText
    }
  }

  async post(endpoint: string, body: T): Promise<ApiResponse<T>> {
    const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    return {
      data: data as T,
      status: response.status,
      message: response.statusText
    }
  }
}

// 使用例
interface User {
  id: number
  name: string
  email: string
}

const userService = new DataService<User>('https://api.example.com')
const userResponse = await userService.get('users/1')
console.log(userResponse.data.name)`,

    css: `/* モダンなCSSグリッドレイアウト */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

/* アニメーション */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}`,

    python: `# 機械学習の簡単な例
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# データの生成
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2 * X + 1 + np.random.randn(100, 1) * 2

# データの分割
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# モデルの作成と学習
model = LinearRegression()
model.fit(X_train, y_train)

# 予測
y_pred = model.predict(X_test)

# 評価
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"係数: {model.coef_[0][0]:.2f}")
print(f"切片: {model.intercept_[0]:.2f}")
print(f"平均二乗誤差: {mse:.2f}")
print(f"決定係数: {r2:.2f}")`,

    bash: `#!/bin/bash
# 自動バックアップスクリプト

# 設定
BACKUP_DIR="/backup"
SOURCE_DIR="/var/www/html"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$DATE.tar.gz"

# バックアップディレクトリの作成
mkdir -p $BACKUP_DIR

# バックアップの実行
echo "Starting backup..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME" -C "$SOURCE_DIR" .

# 古いバックアップの削除（7日以上）
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

# 結果の確認
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_NAME"
    # Slackに通知（オプション）
    # curl -X POST -H 'Content-type: application/json' \\
    #   --data '{"text":"Backup completed: '$BACKUP_NAME'"}' \\
    #   YOUR_SLACK_WEBHOOK_URL
else
    echo "Backup failed!"
    exit 1
fi`
  }

  return (
    <>
      <EnhancedSEO 
        title="コードサンプル集 | HiroSuwa"
        description="React、TypeScript、Python、CSSなどのプログラミング言語のコードサンプル集。シンタックスハイライト付きで見やすく表示。"
        keywords={['コードサンプル', 'プログラミング', 'React', 'TypeScript', 'Python', 'CSS']}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
              <span className="text-gradient-animation">Code Samples</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              実用的なコードサンプル集。コピー機能付きで簡単に使用できます。
            </p>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">React & Hooks</h2>
              <CodeBlock
                language="jsx"
                value={examples.react}
                filename="UserProfile.jsx"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">TypeScript ジェネリクス</h2>
              <CodeBlock
                language="typescript"
                value={examples.typescript}
                filename="DataService.ts"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">モダンCSS</h2>
              <CodeBlock
                language="css"
                value={examples.css}
                filename="styles.css"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Python 機械学習</h2>
              <CodeBlock
                language="python"
                value={examples.python}
                filename="linear_regression.py"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Bashスクリプト</h2>
              <CodeBlock
                language="bash"
                value={examples.bash}
                filename="backup.sh"
              />
            </motion.div>
          </div>

          {/* LLMO対策: 追加のコンテキスト情報 */}
          <div className="mt-16 p-8 bg-white/5 rounded-xl backdrop-blur-md">
            <h3 className="text-2xl font-bold text-white mb-4">コードサンプルについて</h3>
            <div className="text-gray-300 space-y-4">
              <p>
                このページでは、実際のプロジェクトで使用できる実用的なコードサンプルを提供しています。
                各サンプルは、モダンなベストプラクティスに従って書かれており、
                初心者から上級者まで参考にしていただける内容となっています。
              </p>
              <p>
                コードブロックにはシンタックスハイライト機能が実装されており、
                言語ごとに適切な色分けで表示されます。また、ワンクリックでコード全体を
                クリップボードにコピーできる機能も備えています。
              </p>
              <p>
                作成者: HiroSuwa - Web開発者・コンテンツクリエイター
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
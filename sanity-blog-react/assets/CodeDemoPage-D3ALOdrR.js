import{r as d,j as e,a as p,ak as m,al as x,am as h,m as t}from"./react-vendor-CeN1yosF.js";import{E as u}from"./EnhancedSEO-B35uikUk.js";function a({language:s,value:r,filename:n}){const[l,o]=d.useState(!1),c=async()=>{await navigator.clipboard.writeText(r),o(!0),setTimeout(()=>o(!1),2e3)},i={js:"javascript",ts:"typescript",jsx:"javascript",tsx:"typescript",py:"python",rb:"ruby",sh:"bash",yml:"yaml",json:"json",html:"html",css:"css",scss:"scss",md:"markdown",sql:"sql",xml:"xml"}[s]||s||"text";return e.jsxs("div",{className:"relative group my-6 rounded-xl overflow-hidden shadow-2xl",children:[e.jsxs("div",{className:"bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex gap-1.5",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-red-500"}),e.jsx("div",{className:"w-3 h-3 rounded-full bg-yellow-500"}),e.jsx("div",{className:"w-3 h-3 rounded-full bg-green-500"})]}),e.jsx("span",{className:"text-gray-400 text-sm font-mono",children:n||i})]}),e.jsx("button",{onClick:c,className:"flex items-center gap-2 px-3 py-1 text-gray-400 hover:text-white transition-colors duration-200 rounded-md hover:bg-gray-800",title:"Copy code",children:l?e.jsxs(e.Fragment,{children:[e.jsx(p,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm",children:"Copied!"})]}):e.jsxs(e.Fragment,{children:[e.jsx(m,{className:"w-4 h-4"}),e.jsx("span",{className:"text-sm",children:"Copy"})]})})]}),e.jsxs("div",{className:"relative",children:[e.jsx(x,{language:i,style:h,customStyle:{margin:0,padding:"1.5rem",fontSize:"14px",lineHeight:"1.6",backgroundColor:"#1a1b26"},showLineNumbers:!0,lineNumberStyle:{minWidth:"3em",paddingRight:"1em",color:"#4a5568",userSelect:"none"},children:r}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"})]}),e.jsxs("div",{className:"sr-only",children:[e.jsxs("p",{children:["プログラミングコード: ",i,"言語"]}),e.jsxs("p",{children:["ファイル: ",n||"無題"]}),e.jsxs("p",{children:["コード内容: ",r.substring(0,100),"..."]})]})]})}function b(){const s={react:`// React Hooks の使用例
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
}`,typescript:`// TypeScript ジェネリクスの例
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
console.log(userResponse.data.name)`,css:`/* モダンなCSSグリッドレイアウト */
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
}`,python:`# 機械学習の簡単な例
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
print(f"決定係数: {r2:.2f}")`,bash:`#!/bin/bash
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
fi`};return e.jsxs(e.Fragment,{children:[e.jsx(u,{title:"コードサンプル集 | HiroSuwa",description:"React、TypeScript、Python、CSSなどのプログラミング言語のコードサンプル集。シンタックスハイライト付きで見やすく表示。",keywords:["コードサンプル","プログラミング","React","TypeScript","Python","CSS"]}),e.jsx("div",{className:"min-h-screen bg-gradient-to-b from-gray-900 to-black",children:e.jsxs("div",{className:"container mx-auto px-4 py-16",children:[e.jsxs(t.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8},className:"text-center mb-16",children:[e.jsx("h1",{className:"text-5xl md:text-6xl font-black mb-6 text-white font-display",children:e.jsx("span",{className:"text-gradient-animation",children:"Code Samples"})}),e.jsx("p",{className:"text-xl text-gray-300 max-w-2xl mx-auto",children:"実用的なコードサンプル集。コピー機能付きで簡単に使用できます。"})]}),e.jsxs("div",{className:"space-y-12",children:[e.jsxs(t.div,{initial:{opacity:0,x:-50},animate:{opacity:1,x:0},transition:{duration:.5},children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-6",children:"React & Hooks"}),e.jsx(a,{language:"jsx",value:s.react,filename:"UserProfile.jsx"})]}),e.jsxs(t.div,{initial:{opacity:0,x:50},animate:{opacity:1,x:0},transition:{duration:.5,delay:.1},children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-6",children:"TypeScript ジェネリクス"}),e.jsx(a,{language:"typescript",value:s.typescript,filename:"DataService.ts"})]}),e.jsxs(t.div,{initial:{opacity:0,x:-50},animate:{opacity:1,x:0},transition:{duration:.5,delay:.2},children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-6",children:"モダンCSS"}),e.jsx(a,{language:"css",value:s.css,filename:"styles.css"})]}),e.jsxs(t.div,{initial:{opacity:0,x:50},animate:{opacity:1,x:0},transition:{duration:.5,delay:.3},children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-6",children:"Python 機械学習"}),e.jsx(a,{language:"python",value:s.python,filename:"linear_regression.py"})]}),e.jsxs(t.div,{initial:{opacity:0,x:-50},animate:{opacity:1,x:0},transition:{duration:.5,delay:.4},children:[e.jsx("h2",{className:"text-3xl font-bold text-white mb-6",children:"Bashスクリプト"}),e.jsx(a,{language:"bash",value:s.bash,filename:"backup.sh"})]})]}),e.jsxs("div",{className:"mt-16 p-8 bg-white/5 rounded-xl backdrop-blur-md",children:[e.jsx("h3",{className:"text-2xl font-bold text-white mb-4",children:"コードサンプルについて"}),e.jsxs("div",{className:"text-gray-300 space-y-4",children:[e.jsx("p",{children:"このページでは、実際のプロジェクトで使用できる実用的なコードサンプルを提供しています。 各サンプルは、モダンなベストプラクティスに従って書かれており、 初心者から上級者まで参考にしていただける内容となっています。"}),e.jsx("p",{children:"コードブロックにはシンタックスハイライト機能が実装されており、 言語ごとに適切な色分けで表示されます。また、ワンクリックでコード全体を クリップボードにコピーできる機能も備えています。"}),e.jsx("p",{children:"作成者: HiroSuwa - Web開発者・コンテンツクリエイター"})]})]})]})})]})}export{b as default};

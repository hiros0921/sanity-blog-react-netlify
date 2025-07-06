import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  language: string
  value: string
  filename?: string
}

export default function CodeBlock({ language, value, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 言語のマッピング
  const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    py: 'python',
    rb: 'ruby',
    sh: 'bash',
    yml: 'yaml',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    md: 'markdown',
    sql: 'sql',
    xml: 'xml'
  }

  const displayLanguage = languageMap[language] || language || 'text'

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden shadow-2xl">
      {/* ヘッダー */}
      <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          {/* macOS風のドット */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* ファイル名または言語 */}
          <span className="text-gray-400 text-sm font-mono">
            {filename || displayLanguage}
          </span>
        </div>

        {/* コピーボタン */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-gray-400 hover:text-white transition-colors duration-200 rounded-md hover:bg-gray-800"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* コードブロック */}
      <div className="relative">
        <SyntaxHighlighter
          language={displayLanguage}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '14px',
            lineHeight: '1.6',
            backgroundColor: '#1a1b26'
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#4a5568',
            userSelect: 'none'
          }}
        >
          {value}
        </SyntaxHighlighter>

        {/* ホバー時のグラデーション効果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* LLMO対策: コードの説明を非表示で追加 */}
      <div className="sr-only">
        <p>プログラミングコード: {displayLanguage}言語</p>
        <p>ファイル: {filename || '無題'}</p>
        <p>コード内容: {value.substring(0, 100)}...</p>
      </div>
    </div>
  )
}

// 使用例を示すデモコンポーネント
export function CodeBlockDemo() {
  const exampleCode = {
    javascript: `// React コンポーネントの例
import React, { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

export default Counter`,
    typescript: `// TypeScript インターフェースの例
interface User {
  id: number
  name: string
  email: string
  roles: Role[]
}

interface Role {
  id: number
  name: string
  permissions: string[]
}

const user: User = {
  id: 1,
  name: "HiroSuwa",
  email: "example@email.com",
  roles: [{
    id: 1,
    name: "admin",
    permissions: ["read", "write", "delete"]
  }]
}`,
    python: `# Python クラスの例
class BlogPost:
    def __init__(self, title, content, author):
        self.title = title
        self.content = content
        self.author = author
        self.created_at = datetime.now()
    
    def publish(self):
        print(f"Publishing: {self.title}")
        return True
    
    def __str__(self):
        return f"{self.title} by {self.author}"`
  }

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-3xl font-bold text-white mb-8">コードブロックの例</h2>
      
      <CodeBlock
        language="javascript"
        value={exampleCode.javascript}
        filename="Counter.jsx"
      />
      
      <CodeBlock
        language="typescript"
        value={exampleCode.typescript}
        filename="types.ts"
      />
      
      <CodeBlock
        language="python"
        value={exampleCode.python}
        filename="blog.py"
      />
    </div>
  )
}
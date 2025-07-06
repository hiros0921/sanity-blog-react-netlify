import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // スムーズなアニメーション用のスプリング設定
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  useEffect(() => {
    // タッチデバイスのチェック
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }
    checkTouchDevice()

    // タッチデバイスの場合は早期リターン
    if (isTouchDevice) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isLink = target.tagName === 'A' || 
                    target.tagName === 'BUTTON' || 
                    target.closest('a') !== null ||
                    target.closest('button') !== null ||
                    window.getComputedStyle(target).cursor === 'pointer'
      
      setIsPointer(isLink)
    }

    const handleMouseLeave = () => {
      setIsHidden(true)
    }

    const handleMouseEnter = () => {
      setIsHidden(false)
    }

    // イベントリスナーの登録
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    document.body.addEventListener('mouseenter', handleMouseEnter)

    // デフォルトカーソルを非表示
    document.body.style.cursor = 'none'
    
    // すべてのインタラクティブ要素のカーソルを非表示
    const style = document.createElement('style')
    style.innerHTML = `
      * {
        cursor: none !important;
      }
      a, button, input, textarea, select {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.style.cursor = 'auto'
      document.head.removeChild(style)
    }
  }, [cursorX, cursorY, isTouchDevice])

  // タッチデバイスでは何も表示しない
  if (isTouchDevice) {
    return null
  }

  return (
    <>
      {/* メインカーソル */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          opacity: isHidden ? 0 : 1
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          backgroundColor: isPointer ? '#3b82f6' : '#ffffff'
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full" />
      </motion.div>

      {/* フォローカーソル（外側の円） */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          opacity: isHidden ? 0 : 0.3
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5
        }}
      >
        <div 
          className={`w-12 h-12 rounded-full border-2 ${
            isPointer ? 'border-blue-500' : 'border-white'
          } transition-colors duration-200`}
        />
      </motion.div>

      {/* ホバーエフェクト */}
      {isPointer && (
        <motion.div
          className="fixed pointer-events-none z-[9997]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            x: mousePosition.x - 32,
            y: mousePosition.y - 32,
            scale: 1,
            opacity: 0.1
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 rounded-full bg-blue-500" />
        </motion.div>
      )}
    </>
  )
}
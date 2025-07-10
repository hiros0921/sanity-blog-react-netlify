import { motion } from 'framer-motion'
import { useABTest } from '../lib/abTesting'

interface ButtonVariant {
  text: string
  style: {
    backgroundColor: string
    hoverBackgroundColor: string
    textColor: string
    padding: string
    borderRadius: string
    fontSize: string
    fontWeight: string
    animation?: 'pulse' | 'glow' | 'none'
  }
}

interface ABTestButtonProps {
  testId: string
  testName: string
  testDescription: string
  variantA: ButtonVariant
  variantB: ButtonVariant
  onClick?: () => void
  className?: string
}

export default function ABTestButton({
  testId,
  testName,
  testDescription,
  variantA,
  variantB,
  onClick,
  className = ''
}: ABTestButtonProps) {
  const { value, recordConversion } = useABTest({
    id: testId,
    name: testName,
    description: testDescription,
    variants: {
      A: variantA,
      B: variantB
    },
    goal: 'click'
  })

  const handleClick = () => {
    recordConversion()
    onClick?.()
  }

  const buttonVariant = value

  // アニメーションバリアント
  const animationVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    glow: {
      boxShadow: [
        '0 0 0 0 rgba(59, 130, 246, 0)',
        '0 0 20px 10px rgba(59, 130, 246, 0.3)',
        '0 0 0 0 rgba(59, 130, 246, 0)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    none: {}
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`transition-all duration-300 ${className}`}
      style={{
        backgroundColor: buttonVariant.style.backgroundColor,
        color: buttonVariant.style.textColor,
        padding: buttonVariant.style.padding,
        borderRadius: buttonVariant.style.borderRadius,
        fontSize: buttonVariant.style.fontSize,
        fontWeight: buttonVariant.style.fontWeight
      }}
      whileHover={{
        backgroundColor: buttonVariant.style.hoverBackgroundColor,
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      animate={buttonVariant.style.animation ? animationVariants[buttonVariant.style.animation] : {}}
    >
      {buttonVariant.text}
    </motion.button>
  )
}
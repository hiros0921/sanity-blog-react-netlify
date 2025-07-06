import { useEffect, useState } from 'react'

// A/Bテストのバリアント定義
export type Variant = 'A' | 'B'

// テストの設定
export interface ABTest {
  id: string
  name: string
  description: string
  variants: {
    A: any
    B: any
  }
  weights?: {
    A: number
    B: number
  }
  goal: 'click' | 'conversion' | 'engagement' | 'time'
}

// ユーザーのテスト割り当てを管理
class ABTestManager {
  private static instance: ABTestManager
  private assignments: Map<string, Variant> = new Map()
  private results: Map<string, { variant: Variant; conversions: number; impressions: number }> = new Map()

  private constructor() {
    // localStorage から既存の割り当てを読み込み
    const saved = localStorage.getItem('ab_test_assignments')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        this.assignments = new Map(Object.entries(data))
      } catch (e) {
        console.error('Failed to load AB test assignments:', e)
      }
    }

    // 結果も読み込み
    const savedResults = localStorage.getItem('ab_test_results')
    if (savedResults) {
      try {
        const data = JSON.parse(savedResults)
        this.results = new Map(Object.entries(data))
      } catch (e) {
        console.error('Failed to load AB test results:', e)
      }
    }
  }

  static getInstance(): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager()
    }
    return ABTestManager.instance
  }

  // ユーザーをテストバリアントに割り当て
  getVariant(testId: string, weights?: { A: number; B: number }): Variant {
    // 既存の割り当てがあれば使用
    const existing = this.assignments.get(testId)
    if (existing) {
      return existing
    }

    // 新しい割り当てを作成
    const totalWeight = (weights?.A || 50) + (weights?.B || 50)
    const random = Math.random() * totalWeight
    const variant: Variant = random < (weights?.A || 50) ? 'A' : 'B'

    // 保存
    this.assignments.set(testId, variant)
    this.saveAssignments()

    // インプレッションを記録
    this.recordImpression(testId, variant)

    return variant
  }

  // インプレッションを記録
  recordImpression(testId: string, variant: Variant) {
    const key = `${testId}_${variant}`
    const current = this.results.get(key) || { variant, conversions: 0, impressions: 0 }
    current.impressions++
    this.results.set(key, current)
    this.saveResults()
  }

  // コンバージョンを記録
  recordConversion(testId: string) {
    const variant = this.assignments.get(testId)
    if (!variant) return

    const key = `${testId}_${variant}`
    const current = this.results.get(key) || { variant, conversions: 0, impressions: 0 }
    current.conversions++
    this.results.set(key, current)
    this.saveResults()

    // Google Analyticsにイベント送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant: variant,
        event_category: 'AB Test'
      })
    }
  }

  // テスト結果を取得
  getResults(testId: string) {
    const resultA = this.results.get(`${testId}_A`) || { variant: 'A', conversions: 0, impressions: 0 }
    const resultB = this.results.get(`${testId}_B`) || { variant: 'B', conversions: 0, impressions: 0 }

    const rateA = resultA.impressions > 0 ? resultA.conversions / resultA.impressions : 0
    const rateB = resultB.impressions > 0 ? resultB.conversions / resultB.impressions : 0

    return {
      A: {
        ...resultA,
        conversionRate: rateA
      },
      B: {
        ...resultB,
        conversionRate: rateB
      },
      winner: rateA > rateB ? 'A' : rateB > rateA ? 'B' : null,
      confidence: this.calculateConfidence(resultA, resultB)
    }
  }

  // 統計的信頼度を計算（簡易版）
  private calculateConfidence(
    resultA: { conversions: number; impressions: number },
    resultB: { conversions: number; impressions: number }
  ): number {
    if (resultA.impressions < 100 || resultB.impressions < 100) {
      return 0 // 十分なデータがない
    }

    const rateA = resultA.conversions / resultA.impressions
    const rateB = resultB.conversions / resultB.impressions
    const pooledRate = (resultA.conversions + resultB.conversions) / (resultA.impressions + resultB.impressions)
    
    const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / resultA.impressions + 1 / resultB.impressions))
    const z = Math.abs(rateA - rateB) / se

    // Z値から信頼度を概算
    if (z >= 2.58) return 99 // 99%信頼度
    if (z >= 1.96) return 95 // 95%信頼度
    if (z >= 1.64) return 90 // 90%信頼度
    return Math.min(z * 50, 89) // それ以下
  }

  // 割り当てを保存
  private saveAssignments() {
    const data = Object.fromEntries(this.assignments)
    localStorage.setItem('ab_test_assignments', JSON.stringify(data))
  }

  // 結果を保存
  private saveResults() {
    const data = Object.fromEntries(this.results)
    localStorage.setItem('ab_test_results', JSON.stringify(data))
  }

  // テストをリセット（開発用）
  resetTest(testId: string) {
    this.assignments.delete(testId)
    this.results.delete(`${testId}_A`)
    this.results.delete(`${testId}_B`)
    this.saveAssignments()
    this.saveResults()
  }
}

// React Hook: A/Bテストを使用
export function useABTest<T>(test: ABTest & { variants: { A: T; B: T } }): {
  variant: Variant
  value: T
  recordConversion: () => void
} {
  const manager = ABTestManager.getInstance()
  const [variant] = useState(() => manager.getVariant(test.id, test.weights))
  
  const recordConversion = () => {
    manager.recordConversion(test.id)
  }

  return {
    variant,
    value: test.variants[variant],
    recordConversion
  }
}

// テスト結果を取得するHook
export function useABTestResults(testId: string) {
  const manager = ABTestManager.getInstance()
  const [results, setResults] = useState(() => manager.getResults(testId))

  useEffect(() => {
    const interval = setInterval(() => {
      setResults(manager.getResults(testId))
    }, 5000) // 5秒ごとに更新

    return () => clearInterval(interval)
  }, [testId])

  return results
}

// グローバルインスタンスをエクスポート
export const abTestManager = ABTestManager.getInstance()
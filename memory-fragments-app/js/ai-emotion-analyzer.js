// AI感情分析UI（分析ロジックはサービス層へ分離）
class AIEmotionAnalyzer {
    constructor(options = {}) {
        this.service = new EmotionAnalysisService({
            mode: options.mode || 'mock',
            apiConfig: options.apiConfig
        });
    }

    setMode(mode) {
        this.service.setMode(mode);
    }

    setProvider(mode, provider) {
        this.service.setProvider(mode, provider);
    }

    async analyzeEmotion(text, options = {}) {
        return this.service.analyze(text, options);
    }

    createErrorUI(error, provider) {
        return `
            <div class="emotion-analysis bg-red-900/20 backdrop-blur-lg rounded-xl p-4 mt-4 border border-red-400/30">
                <h4 class="text-lg font-bold mb-3 text-red-300">⚠️ AI感情分析エラー</h4>
                <div class="text-sm text-gray-300 mb-2">${error?.message || '分析に失敗しました。'}</div>
                <div class="text-xs text-gray-400">${provider ? `プロバイダ: ${provider}` : ''}</div>
                <div class="mt-3 text-xs text-gray-400">少し時間をおいて再度お試しください。</div>
            </div>
        `;
    }

    createRetryNotice(retries) {
        if (!Number.isFinite(retries) || retries <= 0) {
            return '';
        }

        const retryCountLabel = retries === 1 ? '1回だけ' : `${retries}回`;

        return `
            <div class="mt-1 text-[11px] text-gray-500">
                接続調整のため、${retryCountLabel}再試行しました。
            </div>
        `;
    }

    createAnalysisUI(analysis) {
        if (!analysis) {
            return this.createErrorUI({ message: '分析結果が取得できませんでした。' }, 'unknown');
        }

        if (analysis.error) {
            return this.createErrorUI(analysis.error, analysis.provider);
        }

        const isPremium = Boolean(analysis.isPremiumAnalysis);

        return `
            <div class="emotion-analysis bg-purple-900/20 backdrop-blur-lg rounded-xl p-4 mt-4 border border-purple-400/30">
                <h4 class="text-lg font-bold mb-3 text-purple-300">
                    🤖 AI感情分析
                    ${isPremium ? '<span class="text-xs ml-2 px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">PREMIUM</span>' : ''}
                </h4>
                ${this.createRetryNotice(analysis.retries)}
                
                <div class="primary-emotion mb-4 text-center">
                    <div class="text-4xl mb-2">${analysis.primaryEmotion?.emoji || '😐'}</div>
                    <div class="text-lg font-semibold" style="color: ${analysis.primaryEmotion?.color || '#6b7280'}">
                        ${analysis.primaryEmotion?.label || '分析中...'}
                    </div>
                    <div class="sentiment-bar mt-2">
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="h-2 rounded-full transition-all duration-500" 
                                 style="width: ${50 + (analysis.sentiment * 50)}%; 
                                        background: linear-gradient(to right, #ef4444, #10b981)">
                            </div>
                        </div>
                        <div class="text-xs mt-1 text-gray-400">
                            センチメント: ${analysis.sentiment > 0 ? 'ポジティブ' : analysis.sentiment < 0 ? 'ネガティブ' : 'ニュートラル'}
                        </div>
                    </div>
                </div>

                ${analysis.secondaryEmotions?.length > 0 ? `
                    <div class="secondary-emotions mb-4">
                        <div class="text-sm text-gray-400 mb-2">その他の感情:</div>
                        <div class="flex gap-2 justify-center">
                            ${analysis.secondaryEmotions.map(e => `
                                <span class="text-2xl" title="${e.label}">${e.emoji}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="summary mb-4 text-sm text-gray-300">
                    ${analysis.summary || ''}
                </div>

                ${analysis.keywords?.length > 0 ? `
                    <div class="keywords mb-4">
                        <div class="text-sm text-gray-400 mb-2">キーワード:</div>
                        <div class="flex flex-wrap gap-2">
                            ${analysis.keywords.map(keyword => `
                                <span class="px-2 py-1 bg-purple-800/30 rounded-full text-xs">
                                    ${keyword}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${isPremium && analysis.insights?.length > 0 ? `
                    <div class="insights mb-4">
                        <div class="text-sm text-gray-400 mb-2">インサイト:</div>
                        <ul class="text-sm text-gray-300 space-y-1">
                            ${analysis.insights.map(insight => `
                                <li class="flex items-start">
                                    <span class="mr-2">💡</span>
                                    <span>${insight}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${isPremium && analysis.emotionalJourney?.length > 0 ? `
                    <div class="emotional-journey mb-4">
                        <div class="text-sm text-gray-400 mb-2">感情の変化:</div>
                        <div class="flex gap-1 justify-center">
                            ${analysis.emotionalJourney.map(e => `
                                <span class="text-xl" title="${e.text}">${e.emotion}</span>
                            `).join(' → ')}
                        </div>
                    </div>
                ` : ''}

                ${!isPremium ? `
                    <div class="upgrade-prompt mt-4 p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg">
                        <p class="text-xs text-gray-300">
                            🌟 プレミアムにアップグレードして、より詳細な感情分析とインサイトを取得しましょう
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// グローバルインスタンス
const aiEmotionAnalyzer = new AIEmotionAnalyzer();

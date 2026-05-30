// Emotion analysis service layer (mock + API). Keep UI separate from analysis logic.
(function (global) {
    const EMOTION_CATALOG = {
        positive: {
            keywords: ['嬉しい', '楽しい', '幸せ', '最高', '素晴らしい', '良い', '好き', '愛', 'ありがとう', '感謝', '喜び', '笑', '満足', '成功', '達成', '祝', '楽しみ', 'わくわく', 'ドキドキ'],
            emoji: '😊',
            color: '#10b981',
            label: '幸せ・喜び'
        },
        negative: {
            keywords: ['悲しい', '辛い', '苦しい', '痛い', '嫌', '最悪', '失敗', '後悔', '寂しい', '泣', '涙', '不安', '心配', '怖い', '恐怖', 'ストレス', '疲れ', 'がっかり'],
            emoji: '😢',
            color: '#3b82f6',
            label: '悲しみ・不安'
        },
        angry: {
            keywords: ['怒り', '腹立つ', 'むかつく', 'イライラ', '許せない', '頭にくる', '憤り', '不満', '文句', '愚痴'],
            emoji: '😡',
            color: '#ef4444',
            label: '怒り・不満'
        },
        love: {
            keywords: ['愛してる', '大好き', '恋', 'デート', 'キス', 'ハグ', '彼氏', '彼女', '恋人', '結婚', 'プロポーズ', '記念日', 'バレンタイン'],
            emoji: '💕',
            color: '#ec4899',
            label: '愛・恋愛'
        },
        excited: {
            keywords: ['興奮', 'やった', '最高', 'すごい', '感動', '驚き', 'びっくり', 'サプライズ', '祝い', 'パーティー', 'イベント', '楽しみ'],
            emoji: '🎉',
            color: '#f59e0b',
            label: '興奮・感動'
        },
        peaceful: {
            keywords: ['穏やか', '平和', 'リラックス', '落ち着', '静か', '癒し', '休息', '眠', '瞑想', 'のんびり', 'ゆっくり'],
            emoji: '😌',
            color: '#8b5cf6',
            label: '平穏・安らぎ'
        },
        nostalgic: {
            keywords: ['懐かしい', '思い出', '昔', '子供の頃', '学生時代', '青春', '記憶', '過去', 'あの頃', 'タイムスリップ'],
            emoji: '🌅',
            color: '#f97316',
            label: '懐かしさ'
        }
    };

    const SENTIMENT_PATTERNS = {
        veryPositive: /とても.*?(良|嬉しい|楽しい|幸せ)|最高|素晴らしい|感動的|完璧/gi,
        positive: /良い|嬉しい|楽しい|幸せ|好き|ありがとう/gi,
        veryNegative: /とても.*?(悪|悲しい|辛い|苦しい)|最悪|ひどい|耐えられない/gi,
        negative: /悪い|悲しい|辛い|苦しい|嫌い|つらい/gi
    };

    function createDefaultAnalysis() {
        return {
            primaryEmotion: {
                type: 'neutral',
                emoji: '😐',
                color: '#6b7280',
                label: '中立',
                score: 0
            },
            secondaryEmotions: [],
            sentiment: 0,
            emotionScores: {},
            keywords: [],
            summary: 'テキストが短すぎて分析できません。',
            insights: [],
            provider: 'mock',
            retries: 0,
            analysisId: null
        };
    }

    function createErrorAnalysis(error, mode) {
        const message = typeof error === 'string'
            ? error
            : error?.message || '感情分析に失敗しました。';

        return {
            ...createDefaultAnalysis(),
            error: {
                message,
                code: error?.code || 'analysis_error',
                retryable: Boolean(error?.retryable)
            },
            provider: mode || 'mock',
            retries: normalizeRetries(error?.retries),
            analysisId: error?.analysisId || null
        };
    }

    function normalizeRetries(value) {
        const retries = Number(value);

        if (!Number.isFinite(retries) || retries < 0) {
            return 0;
        }

        return Math.floor(retries);
    }

    function getEmotionDescriptor(type) {
        if (!type) return null;
        const normalized = String(type).toLowerCase();
        if (EMOTION_CATALOG[normalized]) {
            return { type: normalized, ...EMOTION_CATALOG[normalized] };
        }
        return { type: normalized, label: normalized, emoji: '😐', color: '#6b7280' };
    }

    function normalizeEmotion(input) {
        if (!input) return null;
        if (typeof input === 'string') {
            return getEmotionDescriptor(input);
        }
        const base = getEmotionDescriptor(input.type || input.name || input.key);
        return {
            ...base,
            label: input.label || base.label,
            emoji: input.emoji || base.emoji,
            color: input.color || base.color,
            score: typeof input.score === 'number' ? input.score : base.score
        };
    }

    function normalizeSecondaryEmotions(list) {
        if (!Array.isArray(list)) return [];
        return list.map(normalizeEmotion).filter(Boolean);
    }

    function normalizeSentiment(value) {
        if (typeof value === 'number') return value;
        if (value && typeof value === 'object') {
            if (typeof value.score === 'number') return value.score;
            if (typeof value.positive === 'number' || typeof value.negative === 'number') {
                const positive = value.positive || 0;
                const negative = value.negative || 0;
                return Math.max(-1, Math.min(1, positive - negative));
            }
        }
        return 0;
    }

    function buildSummary(analysis) {
        if (!analysis.primaryEmotion) {
            return '感情を特定できませんでした。';
        }

        const emotion = analysis.primaryEmotion;
        let summary = `${emotion.emoji} ${emotion.label}を感じる内容です。`;

        if (analysis.sentiment > 0.5) {
            summary += ' とてもポジティブな記憶ですね。';
        } else if (analysis.sentiment < -0.5) {
            summary += ' 少し辛い経験だったようです。';
        }

        if (analysis.secondaryEmotions.length > 0) {
            const secondary = analysis.secondaryEmotions.map(e => e.emoji).join('');
            summary += ` 他にも${secondary}の感情が含まれています。`;
        }

        return summary;
    }

    function normalizeAnalysisResponse(response, context) {
        if (!response) return createDefaultAnalysis();
        if (response.error) {
            return createErrorAnalysis(response.error, context?.mode);
        }

        if (response.primaryEmotion || response.secondaryEmotions) {
            return {
                ...response,
                summary: response.summary || buildSummary(response),
                provider: response.provider || context?.mode || 'mock',
                retries: normalizeRetries(response.retries),
                analysisId: response.analysisId || null
            };
        }

        const data = response.data || response.result || response;
        const primary = normalizeEmotion(data.primary_emotion || data.primaryEmotion || data.emotion);
        const secondary = normalizeSecondaryEmotions(data.secondary_emotions || data.secondaryEmotions || data.emotions);
        const sentiment = normalizeSentiment(data.sentiment || data.sentiment_score || data.sentimentScore);
        const emotionScores = data.emotion_scores || data.emotionScores || {};

        const normalized = {
            primaryEmotion: primary,
            secondaryEmotions: secondary,
            sentiment,
            emotionScores,
            keywords: data.keywords || [],
            insights: data.insights || [],
            emotionalJourney: data.emotional_journey || data.emotionalJourney || [],
            isPremiumAnalysis: Boolean(data.is_premium || context?.isPremium),
            provider: context?.mode || 'api',
            retries: normalizeRetries(data.retries ?? response.retries),
            analysisId: data.analysisId || response.analysisId || null
        };

        normalized.summary = data.summary || data.analysis_summary || buildSummary(normalized);

        return normalized;
    }

    class MockEmotionProvider {
        constructor() {
            this.emotions = EMOTION_CATALOG;
            this.sentimentPatterns = SENTIMENT_PATTERNS;
        }

        async analyze(text, options = {}) {
            if (!text || text.length < 5) {
                return createDefaultAnalysis();
            }

            const basicAnalysis = this.performBasicAnalysis(text);

            if (options.isPremium) {
                const advancedAnalysis = await this.performAdvancedAnalysis(text);
                return this.mergeAnalyses(basicAnalysis, advancedAnalysis);
            }

            return basicAnalysis;
        }

        performBasicAnalysis(text) {
            const analysis = {
                primaryEmotion: null,
                secondaryEmotions: [],
                sentiment: 0,
                emotionScores: {},
                keywords: [],
                summary: '',
                insights: []
            };

            for (const [emotionKey, emotion] of Object.entries(this.emotions)) {
                const score = this.calculateEmotionScore(text, emotion.keywords);
                analysis.emotionScores[emotionKey] = score;
            }

            const sortedEmotions = Object.entries(analysis.emotionScores)
                .sort((a, b) => b[1] - a[1]);

            if (sortedEmotions[0][1] > 0) {
                analysis.primaryEmotion = {
                    type: sortedEmotions[0][0],
                    ...this.emotions[sortedEmotions[0][0]],
                    score: sortedEmotions[0][1]
                };
            }

            for (let i = 1; i < Math.min(3, sortedEmotions.length); i++) {
                if (sortedEmotions[i][1] > 0.2) {
                    analysis.secondaryEmotions.push({
                        type: sortedEmotions[i][0],
                        ...this.emotions[sortedEmotions[i][0]],
                        score: sortedEmotions[i][1]
                    });
                }
            }

            analysis.sentiment = this.calculateSentiment(text);
            analysis.keywords = this.extractKeywords(text);
            analysis.summary = buildSummary({
                ...analysis,
                primaryEmotion: analysis.primaryEmotion || getEmotionDescriptor('neutral')
            });

            return analysis;
        }

        async performAdvancedAnalysis(text) {
            const advancedAnalysis = {
                insights: [],
                patterns: [],
                recommendations: [],
                emotionalJourney: [],
                timeAnalysis: null
            };

            if (text.length > 100) {
                const paragraphs = text.split(/\n\n|\n/).filter(p => p.length > 10);
                advancedAnalysis.emotionalJourney = paragraphs.map((para, index) => {
                    const emotion = this.performBasicAnalysis(para);
                    return {
                        position: index,
                        text: para.substring(0, 50) + '...',
                        emotion: emotion.primaryEmotion?.emoji || '😐',
                        sentiment: emotion.sentiment
                    };
                });
            }

            advancedAnalysis.patterns = this.detectPatterns(text);
            advancedAnalysis.insights = this.generateInsights(text, advancedAnalysis.patterns);
            advancedAnalysis.recommendations = this.generateRecommendations(advancedAnalysis);
            advancedAnalysis.timeAnalysis = this.analyzeTimeReferences(text);

            return advancedAnalysis;
        }

        calculateEmotionScore(text, keywords) {
            let score = 0;
            const lowerText = text.toLowerCase();

            for (const keyword of keywords) {
                const regex = new RegExp(keyword, 'gi');
                const matches = lowerText.match(regex);
                if (matches) {
                    score += matches.length * (1 / keywords.length);
                }
            }

            return Math.min(1, score * (100 / text.length));
        }

        calculateSentiment(text) {
            let score = 0;

            const veryPositiveMatches = text.match(this.sentimentPatterns.veryPositive);
            const positiveMatches = text.match(this.sentimentPatterns.positive);
            const veryNegativeMatches = text.match(this.sentimentPatterns.veryNegative);
            const negativeMatches = text.match(this.sentimentPatterns.negative);

            if (veryPositiveMatches) score += veryPositiveMatches.length * 0.3;
            if (positiveMatches) score += positiveMatches.length * 0.1;
            if (veryNegativeMatches) score -= veryNegativeMatches.length * 0.3;
            if (negativeMatches) score -= negativeMatches.length * 0.1;

            return Math.max(-1, Math.min(1, score / 10));
        }

        extractKeywords(text) {
            const keywords = [];
            const allKeywords = Object.values(this.emotions).flatMap(e => e.keywords);

            for (const keyword of allKeywords) {
                if (text.includes(keyword)) {
                    keywords.push(keyword);
                }
            }

            return [...new Set(keywords)].slice(0, 5);
        }

        detectPatterns(text) {
            const patterns = [];

            if (text.match(/[？?]/g)?.length > 2) {
                patterns.push({ type: 'questioning', label: '多くの疑問を含む' });
            }

            if (text.match(/[！!]/g)?.length > 3) {
                patterns.push({ type: 'exclamation', label: '強い感情表現' });
            }

            const words = text.split(/\s+/);
            const wordCounts = {};
            words.forEach(word => {
                if (word.length > 2) {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                }
            });
            const repeatedWords = Object.entries(wordCounts)
                .filter(([, count]) => count > 3)
                .map(([word]) => word);

            if (repeatedWords.length > 0) {
                patterns.push({
                    type: 'repetition',
                    label: '繰り返し表現',
                    words: repeatedWords
                });
            }

            return patterns;
        }

        generateInsights(text, patterns) {
            const insights = [];

            if (text.length > 500) {
                insights.push('詳細な記録をされていますね。振り返りに最適です。');
            } else if (text.length < 50) {
                insights.push('簡潔な記録です。後で詳細を追加してみては？');
            }

            patterns.forEach(pattern => {
                switch (pattern.type) {
                    case 'questioning':
                        insights.push('多くの疑問や不確実性を感じているようです。');
                        break;
                    case 'exclamation':
                        insights.push('強い感情が表現されています。');
                        break;
                    case 'repetition':
                        insights.push(`「${pattern.words[0]}」という言葉が繰り返されています。重要なポイントかもしれません。`);
                        break;
                }
            });

            return insights;
        }

        generateRecommendations(analysis) {
            const recommendations = [];

            if (analysis.emotionalJourney?.length > 3) {
                const emotionChanges = analysis.emotionalJourney.filter((e, i) =>
                    i > 0 && e.sentiment !== analysis.emotionalJourney[i - 1].sentiment
                ).length;

                if (emotionChanges > 2) {
                    recommendations.push('感情の変化が多い一日でした。リラックスする時間を作りましょう。');
                }
            }

            return recommendations;
        }

        analyzeTimeReferences(text) {
            const timePatterns = {
                morning: /朝|午前|モーニング|起床|目覚め/gi,
                afternoon: /昼|午後|ランチ|お昼/gi,
                evening: /夕方|夕食|夕暮れ/gi,
                night: /夜|深夜|就寝|眠/gi,
                past: /昔|以前|かつて|昨日|先週|先月|去年/gi,
                future: /明日|来週|来月|来年|将来|今後/gi
            };

            const timeAnalysis = {};
            for (const [time, pattern] of Object.entries(timePatterns)) {
                const matches = text.match(pattern);
                if (matches) {
                    timeAnalysis[time] = matches.length;
                }
            }

            return Object.keys(timeAnalysis).length > 0 ? timeAnalysis : null;
        }

        mergeAnalyses(basic, advanced) {
            return {
                ...basic,
                ...advanced,
                insights: [...basic.insights, ...advanced.insights],
                isPremiumAnalysis: true
            };
        }
    }

    class ApiEmotionProvider {
        constructor(config = {}) {
            this.endpoint = config.endpoint || '/api/emotion-analysis';
            this.model = config.model || 'gpt-4.1-mini';
        }

        async analyze(text, options = {}) {
            if (!this.endpoint) {
                throw new Error('API endpoint is not configured.');
            }

            // Replace this with your real backend or OpenAI proxy endpoint.
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    isPremium: Boolean(options.isPremium),
                    model: options.model || this.model
                })
            });

            if (!response.ok) {
                let errorPayload = null;

                try {
                    errorPayload = await response.json();
                } catch (parseError) {
                    errorPayload = null;
                }

                const message = errorPayload?.error?.message
                    || errorPayload?.message
                    || `API error: ${response.status}`;
                const error = new Error(message);
                error.code = String(response.status);
                error.retryable = response.status >= 500;
                error.retries = normalizeRetries(errorPayload?.retries);
                error.analysisId = errorPayload?.analysisId || null;
                throw error;
            }

            return response.json();
        }
    }

    class EmotionAnalysisService {
        constructor(config = {}) {
            this.mode = config.mode || 'mock';
            this.providers = {
                mock: config.mockProvider || new MockEmotionProvider(),
                api: config.apiProvider || new ApiEmotionProvider(config.apiConfig)
            };
        }

        setMode(mode) {
            if (mode === 'mock' || mode === 'api') {
                this.mode = mode;
            }
        }

        setProvider(mode, provider) {
            if (provider && (mode === 'mock' || mode === 'api')) {
                this.providers[mode] = provider;
            }
        }

        async analyze(text, options = {}) {
            const mode = options.mode || this.mode;
            const provider = this.providers[mode] || this.providers.mock;

            if (!text || text.length < 5) {
                return createDefaultAnalysis();
            }

            try {
                const response = await provider.analyze(text, options);
                return normalizeAnalysisResponse(response, { mode, isPremium: options.isPremium });
            } catch (error) {
                return createErrorAnalysis(error, mode);
            }
        }
    }

    global.EMOTION_CATALOG = EMOTION_CATALOG;
    global.EmotionAnalysisService = EmotionAnalysisService;
    global.MockEmotionProvider = MockEmotionProvider;
    global.ApiEmotionProvider = ApiEmotionProvider;
})(window);

// メール通知管理サービス
import type { EmailNotificationSettings } from '../types/membership';

interface EmailTemplate {
  subject: string;
  body: string;
  variables?: Record<string, string>;
}

class EmailNotificationService {
  private static instance: EmailNotificationService;
  private userSettings: Map<string, EmailNotificationSettings> = new Map();
  
  // デフォルトの通知設定
  private readonly DEFAULT_SETTINGS: Omit<EmailNotificationSettings, 'userId'> = {
    newContent: true,
    weeklyDigest: true,
    promotions: true,
    accountUpdates: true,
    commentReplies: true,
    subscriptionReminders: true
  };

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService();
    }
    return EmailNotificationService.instance;
  }

  // ストレージから読み込み
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('emailNotificationSettings');
      if (stored) {
        const settings = JSON.parse(stored);
        Object.entries(settings).forEach(([userId, userSettings]) => {
          this.userSettings.set(userId, userSettings as EmailNotificationSettings);
        });
      }
    } catch (error) {
      console.error('Failed to load email notification settings:', error);
    }
  }

  // ストレージに保存
  private saveToStorage() {
    try {
      const settings: Record<string, EmailNotificationSettings> = {};
      this.userSettings.forEach((userSettings, userId) => {
        settings[userId] = userSettings;
      });
      localStorage.setItem('emailNotificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save email notification settings:', error);
    }
  }

  // ユーザーの通知設定を取得または作成
  async getUserSettings(userId: string): Promise<EmailNotificationSettings> {
    let settings = this.userSettings.get(userId);
    
    if (!settings) {
      settings = {
        userId,
        ...this.DEFAULT_SETTINGS
      };
      this.userSettings.set(userId, settings);
      this.saveToStorage();
    }
    
    return settings;
  }

  // 通知設定の更新
  async updateUserSettings(
    userId: string, 
    updates: Partial<Omit<EmailNotificationSettings, 'userId'>>
  ): Promise<EmailNotificationSettings> {
    const settings = await this.getUserSettings(userId);
    Object.assign(settings, updates);
    this.saveToStorage();
    return settings;
  }

  // メール送信（実際の実装では、バックエンドAPIを経由）
  async sendEmail(
    userId: string,
    type: keyof Omit<EmailNotificationSettings, 'userId'>,
    template: EmailTemplate
  ): Promise<boolean> {
    const settings = await this.getUserSettings(userId);
    
    // ユーザーがこのタイプの通知を受け取る設定になっているかチェック
    if (!settings[type]) {
      console.log(`User ${userId} has opted out of ${type} notifications`);
      return false;
    }

    // 実際の実装では、ここでバックエンドAPIを呼び出してメールを送信
    console.log('Sending email:', {
      userId,
      type,
      subject: template.subject,
      body: this.processTemplate(template.body, template.variables)
    });

    // デモ用：送信履歴を記録
    this.recordEmailSent(userId, type);
    
    return true;
  }

  // テンプレート変数の処理
  private processTemplate(template: string, variables?: Record<string, string>): string {
    if (!variables) return template;
    
    let processed = template;
    Object.entries(variables).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return processed;
  }

  // メール送信履歴の記録
  private recordEmailSent(userId: string, type: string) {
    const history = this.getEmailHistory();
    history.push({
      userId,
      type,
      sentAt: new Date().toISOString()
    });
    
    // 最新の100件のみ保持
    if (history.length > 100) {
      history.shift();
    }
    
    localStorage.setItem('emailHistory', JSON.stringify(history));
  }

  // メール送信履歴の取得
  private getEmailHistory(): any[] {
    try {
      const stored = localStorage.getItem('emailHistory');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // 定型メールテンプレート
  getEmailTemplates() {
    return {
      welcomeEmail: {
        subject: 'HiroSuwaへようこそ！',
        body: `こんにちは、{{userName}}さん！

HiroSuwaへようこそ！アカウントの登録が完了しました。

プレミアムコンテンツを含む、すべての機能をお楽しみください。

何かご不明な点がございましたら、お気軽にお問い合わせください。

HiroSuwaチーム`
      },
      
      subscriptionConfirmation: {
        subject: '{{planName}}プランへのアップグレードが完了しました',
        body: `{{userName}}さん

{{planName}}プランへのアップグレードありがとうございます！

プラン詳細：
- プラン名: {{planName}}
- 料金: ¥{{price}}/月
- 次回請求日: {{nextBillingDate}}

新しい機能をぜひお試しください！

HiroSuwaチーム`
      },
      
      weeklyDigest: {
        subject: '今週の人気記事 - HiroSuwa Weekly',
        body: `{{userName}}さん、こんにちは！

今週の人気記事をお届けします：

{{popularPosts}}

すべての記事を見る: {{siteUrl}}/blog

配信停止をご希望の場合は、設定ページから変更できます。

HiroSuwaチーム`
      },
      
      commentReply: {
        subject: 'あなたのコメントに返信がありました',
        body: `{{userName}}さん

「{{postTitle}}」へのあなたのコメントに{{replyAuthor}}さんから返信がありました。

返信内容：
{{replyContent}}

記事を見る: {{postUrl}}

HiroSuwaチーム`
      }
    };
  }

  // 一括メール送信（管理者用）
  async sendBulkEmail(
    userIds: string[],
    template: EmailTemplate,
    respectUserSettings: boolean = true
  ): Promise<{ sent: number; skipped: number }> {
    let sent = 0;
    let skipped = 0;

    for (const userId of userIds) {
      if (respectUserSettings) {
        const settings = await this.getUserSettings(userId);
        if (settings.promotions) {
          await this.sendEmail(userId, 'promotions', template);
          sent++;
        } else {
          skipped++;
        }
      } else {
        // 強制送信（重要なお知らせなど）
        await this.sendEmail(userId, 'accountUpdates', template);
        sent++;
      }
    }

    return { sent, skipped };
  }
}

export const emailNotificationService = EmailNotificationService.getInstance();
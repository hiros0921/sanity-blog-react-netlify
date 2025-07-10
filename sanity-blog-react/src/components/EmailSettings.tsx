import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Bell, Save, Check, 
  Newspaper, Tag, MessageSquare, CreditCard,
  Calendar, AlertCircle
} from 'lucide-react';
import { emailNotificationService } from '../lib/emailNotification';
import type { EmailNotificationSettings } from '../types/membership';

interface EmailSettingsProps {
  userId: string;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ userId }) => {
  const [settings, setSettings] = useState<EmailNotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const userSettings = await emailNotificationService.getUserSettings(userId);
        setSettings(userSettings);
      } catch (error) {
        console.error('Failed to load email settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userId]);

  const handleToggle = (key: keyof Omit<EmailNotificationSettings, 'userId'>) => {
    if (settings) {
      setSettings({
        ...settings,
        [key]: !settings[key]
      });
      setSaved(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await emailNotificationService.updateUserSettings(userId, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const notificationCategories = [
    {
      key: 'newContent' as const,
      icon: Newspaper,
      title: '新着コンテンツ',
      description: '新しい記事が公開されたときに通知を受け取ります',
      color: 'text-blue-600'
    },
    {
      key: 'weeklyDigest' as const,
      icon: Calendar,
      title: '週刊ダイジェスト',
      description: '週に一度、人気記事のまとめを受け取ります',
      color: 'text-purple-600'
    },
    {
      key: 'promotions' as const,
      icon: Tag,
      title: 'プロモーション・特典',
      description: '限定クーポンや特別オファーの情報を受け取ります',
      color: 'text-green-600'
    },
    {
      key: 'accountUpdates' as const,
      icon: AlertCircle,
      title: 'アカウント更新',
      description: '重要なアカウント情報やセキュリティに関する通知',
      color: 'text-red-600'
    },
    {
      key: 'commentReplies' as const,
      icon: MessageSquare,
      title: 'コメント返信',
      description: 'あなたのコメントに返信があったときに通知',
      color: 'text-orange-600'
    },
    {
      key: 'subscriptionReminders' as const,
      icon: CreditCard,
      title: 'サブスクリプション通知',
      description: '更新日や支払いに関する重要な通知',
      color: 'text-indigo-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading || !settings) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Mail className="w-6 h-6 mr-2 text-purple-600" />
            メール通知設定
          </h2>
          {saved && (
            <div className="flex items-center text-green-600 text-sm">
              <Check className="w-4 h-4 mr-1" />
              保存しました
            </div>
          )}
        </div>

        <div className="space-y-4">
          {notificationCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.key}
                variants={itemVariants}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <Icon className={`w-6 h-6 ${category.color} mr-4 mt-1`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(category.key)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    settings[category.key] ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                      settings[category.key] ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                設定を保存
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* 通知頻度の設定 */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-purple-600" />
          通知頻度の管理
        </h3>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">重要なお知らせ</p>
                <p className="text-yellow-700 mt-1">
                  アカウント更新とサブスクリプション通知は、セキュリティと課金に関わる重要な情報のため、
                  オフにすることを推奨しません。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">通知のまとめ送信</h4>
              <p className="text-sm text-gray-600 mb-3">
                複数の通知を1つのメールにまとめて受信できます
              </p>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                設定する →
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">配信停止</h4>
              <p className="text-sm text-gray-600 mb-3">
                すべてのメール通知を一時的に停止します
              </p>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                一時停止する →
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* プレビュー */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-bold mb-4">メールプレビュー</h3>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="border-b pb-3 mb-3">
            <p className="text-sm text-gray-600">件名:</p>
            <p className="font-medium">今週の人気記事 - HiroSuwa Weekly</p>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p>こんにちは！</p>
            <p>今週HiroSuwaで最も読まれた記事をお届けします。</p>
            <p>気になる記事があれば、ぜひチェックしてみてください。</p>
          </div>
          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
            このメールは設定に基づいて送信されています。
            配信設定は上記のフォームから変更できます。
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailSettings;
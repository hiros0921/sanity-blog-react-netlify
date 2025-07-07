import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { stripeService } from '../lib/stripe';
import type { Invoice } from '../types/membership';

const PaymentHistory: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setLoading(true);
      try {
        // デモ用のモックデータ
        const mockInvoices: Invoice[] = [
          {
            id: 'inv_001',
            amount: 2980,
            currency: 'JPY',
            status: 'paid',
            createdAt: new Date('2025-01-01'),
            paidAt: new Date('2025-01-01')
          },
          {
            id: 'inv_002',
            amount: 2980,
            currency: 'JPY',
            status: 'paid',
            createdAt: new Date('2024-12-01'),
            paidAt: new Date('2024-12-01')
          },
          {
            id: 'inv_003',
            amount: 2980,
            currency: 'JPY',
            status: 'paid',
            createdAt: new Date('2024-11-01'),
            paidAt: new Date('2024-11-01')
          },
          {
            id: 'inv_004',
            amount: 980,
            currency: 'JPY',
            status: 'paid',
            createdAt: new Date('2024-10-01'),
            paidAt: new Date('2024-10-01')
          }
        ];
        
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Failed to load invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'open':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'void':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return '支払い済み';
      case 'open':
        return '支払い待ち';
      case 'void':
        return 'キャンセル';
      default:
        return status;
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
            <CreditCard className="w-6 h-6 mr-2 text-purple-600" />
            支払い履歴
          </h2>
          <button className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
            <Download className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">CSVダウンロード</span>
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">支払い履歴はありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">請求日</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">金額</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">状態</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">支払日</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    variants={itemVariants}
                    custom={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {invoice.createdAt.toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        ¥{invoice.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {getStatusIcon(invoice.status)}
                        <span className="ml-2 text-gray-700">
                          {getStatusText(invoice.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">
                        {invoice.paidAt
                          ? invoice.paidAt.toLocaleDateString('ja-JP')
                          : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium">
                        領収書
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {invoices.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {invoices.length}件の取引を表示
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                前へ
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                次へ
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* 支払い方法 */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-bold mb-4">支払い方法</h3>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center mr-4">
              <CreditCard className="w-6 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-600">有効期限: 12/25</p>
            </div>
          </div>
          <button className="text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium">
            変更
          </button>
        </div>

        <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          新しい支払い方法を追加
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentHistory;
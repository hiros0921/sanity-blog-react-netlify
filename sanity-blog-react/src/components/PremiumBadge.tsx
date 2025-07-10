import React from 'react';
import { Crown, Lock, Sparkles } from 'lucide-react';
import type { MembershipTier } from '../types/membership';

interface PremiumBadgeProps {
  requiredTier: MembershipTier;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  requiredTier, 
  size = 'medium',
  showLabel = true 
}) => {
  if (requiredTier === 'free') return null;

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const labelClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const getIcon = () => {
    switch (requiredTier) {
      case 'basic':
        return <Lock className={sizeClasses[size]} />;
      case 'premium':
        return <Crown className={sizeClasses[size]} />;
      case 'enterprise':
        return <Sparkles className={sizeClasses[size]} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (requiredTier) {
      case 'basic':
        return 'ベーシック';
      case 'premium':
        return 'プレミアム';
      case 'enterprise':
        return 'エンタープライズ';
      default:
        return '';
    }
  };

  const getColorClasses = () => {
    switch (requiredTier) {
      case 'basic':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200';
      default:
        return '';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${getColorClasses()} ${labelClasses[size]}`}>
      {getIcon()}
      {showLabel && <span className="font-medium">{getLabel()}</span>}
    </div>
  );
};

export default PremiumBadge;
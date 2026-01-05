import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

export function KPICard({ title, value, change, trend, icon, color }: KPICardProps) {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 min-w-0">
      <div className="flex flex-col gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]} self-start`}>
          <div className="w-4 h-4 md:w-5 md:h-5">
            {icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2 truncate">{title}</p>
          <p className="text-2xl md:text-3xl mb-1 md:mb-2 truncate">{value}</p>
          
          <div className="flex items-center gap-1 flex-wrap">
            {isPositive ? (
              <TrendingUp size={14} className="text-green-600 flex-shrink-0" />
            ) : (
              <TrendingDown size={14} className="text-red-600 flex-shrink-0" />
            )}
            <span className={`text-xs md:text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500 text-xs md:text-sm">vs last period</span>
          </div>
        </div>
      </div>
    </div>
  );
}
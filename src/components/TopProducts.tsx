import { TrendingUp } from 'lucide-react';
import type { Product } from '../types/analytics';

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 min-w-0 overflow-hidden">
      <h3 className="mb-3 md:mb-4 text-sm md:text-base">Top Products</h3>
      
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No product data available
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100 last:border-0 gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm mb-1 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.orders} orders</p>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                <p className="text-xs md:text-sm whitespace-nowrap">{product.revenue}</p>
                
                <div className={`flex items-center gap-1 ${
                  product.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp 
                    size={12} 
                    className={product.trend < 0 ? 'rotate-180' : ''} 
                  />
                  <span className="text-xs">{Math.abs(product.trend)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
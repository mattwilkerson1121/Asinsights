import { Loader2, Download, Filter, Search, Save } from 'lucide-react';
import type { AnalyticsData, DateRange } from '../types/analytics';
import { useState } from 'react';

interface ReportsTableProps {
  data: AnalyticsData | null;
  loading: boolean;
  error: Error | null;
  dateRange: DateRange;
  onSaveReport?: (name: string, dateRange: DateRange) => void;
}

export function ReportsTable({ data, loading, error, dateRange, onSaveReport }: ReportsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<'name' | 'revenue' | 'orders' | 'trend'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [reportName, setReportName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reports data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 mb-2">Error loading reports data</p>
            <p className="text-red-600 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const handleSort = (column: 'name' | 'revenue' | 'orders' | 'trend') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Filter and sort products
  const filteredProducts = data.topProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortColumn === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortColumn === 'revenue') {
        const aValue = parseFloat(a.revenue.replace(/[$,]/g, ''));
        const bValue = parseFloat(b.revenue.replace(/[$,]/g, ''));
        comparison = aValue - bValue;
      } else if (sortColumn === 'orders') {
        comparison = a.orders - b.orders;
      } else if (sortColumn === 'trend') {
        comparison = a.trend - b.trend;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleSaveReport = () => {
    if (reportName.trim() && onSaveReport) {
      onSaveReport(reportName.trim(), dateRange);
      setReportName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl mb-2">My Reports</h2>
        <p className="text-sm text-gray-600">E-commerce product performance data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
          <p className="text-lg md:text-2xl">{data.kpis.revenue.value}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Orders</p>
          <p className="text-lg md:text-2xl">{data.kpis.orders.value}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Conversion Rate</p>
          <p className="text-lg md:text-2xl">{data.kpis.conversionRate.value}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Avg Order Value</p>
          <p className="text-lg md:text-2xl">{data.kpis.avgOrderValue.value}</p>
        </div>
      </div>

      {/* Table Controls */}
      <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col min-h-0">
        <div className="p-3 md:p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button 
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Save Report</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Product Name
                    {sortColumn === 'name' && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center gap-1">
                    Revenue
                    {sortColumn === 'revenue' && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('orders')}
                >
                  <div className="flex items-center gap-1">
                    Orders
                    {sortColumn === 'orders' && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('trend')}
                >
                  <div className="flex items-center gap-1">
                    Trend
                    {sortColumn === 'trend' && (
                      <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 flex-shrink-0">
                          {product.name.charAt(0)}
                        </div>
                        <span className="truncate">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{product.revenue}</td>
                    <td className="px-4 py-3 text-sm">{product.orders}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 ${
                        product.trend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.trend >= 0 ? '+' : ''}{product.trend}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${
                              product.trend >= 10 ? 'bg-green-500' :
                              product.trend >= 0 ? 'bg-blue-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(Math.abs(product.trend) * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
          Showing {filteredProducts.length} of {data.topProducts.length} products
        </div>
      </div>

      {/* Save Report Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg mb-4">Save Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter a name for this report. It will be saved with the current date range ({dateRange.start} to {dateRange.end}).
            </p>
            <input
              type="text"
              placeholder="Enter report name..."
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveReport()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setReportName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReport}
                disabled={!reportName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { X, Download, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { AnalyticsData } from '../types/analytics';

interface CustomReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  analyticsData: AnalyticsData | null;
  suggestedCriteria?: ReportCriteria;
  onSaveReport?: (reportName: string, criteria: ReportCriteria) => void;
}

export interface ReportCriteria {
  metrics: string[];
  dateRange?: { start: string; end: string };
  filters?: string[];
  groupBy?: string;
}

export function CustomReportGenerator({ 
  isOpen, 
  onClose, 
  analyticsData,
  suggestedCriteria,
  onSaveReport
}: CustomReportGeneratorProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    suggestedCriteria?.metrics || ['revenue', 'orders']
  );
  const [reportName, setReportName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const availableMetrics = [
    { id: 'revenue', label: 'Revenue', category: 'financial' },
    { id: 'orders', label: 'Orders', category: 'financial' },
    { id: 'conversionRate', label: 'Conversion Rate', category: 'performance' },
    { id: 'avgOrderValue', label: 'Avg Order Value', category: 'financial' },
    { id: 'products', label: 'Top Products', category: 'products' },
    { id: 'traffic', label: 'Traffic Sources', category: 'acquisition' },
    { id: 'funnel', label: 'Conversion Funnel', category: 'performance' },
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(m => m !== metricId)
        : [...prev, metricId]
    );
  };

  const generateReportData = () => {
    if (!analyticsData) return [];

    const data: any[] = [];

    if (selectedMetrics.includes('revenue')) {
      data.push({
        metric: 'Total Revenue',
        value: analyticsData.kpis.revenue.value,
        change: `${analyticsData.kpis.revenue.change > 0 ? '+' : ''}${analyticsData.kpis.revenue.change}%`,
        trend: analyticsData.kpis.revenue.trend,
      });
    }

    if (selectedMetrics.includes('orders')) {
      data.push({
        metric: 'Total Orders',
        value: analyticsData.kpis.orders.value,
        change: `${analyticsData.kpis.orders.change > 0 ? '+' : ''}${analyticsData.kpis.orders.change}%`,
        trend: analyticsData.kpis.orders.trend,
      });
    }

    if (selectedMetrics.includes('conversionRate')) {
      data.push({
        metric: 'Conversion Rate',
        value: analyticsData.kpis.conversionRate.value,
        change: `${analyticsData.kpis.conversionRate.change > 0 ? '+' : ''}${analyticsData.kpis.conversionRate.change}%`,
        trend: analyticsData.kpis.conversionRate.trend,
      });
    }

    if (selectedMetrics.includes('avgOrderValue')) {
      data.push({
        metric: 'Avg Order Value',
        value: analyticsData.kpis.avgOrderValue.value,
        change: `${analyticsData.kpis.avgOrderValue.change > 0 ? '+' : ''}${analyticsData.kpis.avgOrderValue.change}%`,
        trend: analyticsData.kpis.avgOrderValue.trend,
      });
    }

    if (selectedMetrics.includes('products')) {
      analyticsData.topProducts.forEach((product, idx) => {
        data.push({
          metric: `Product: ${product.name}`,
          value: product.revenue,
          change: `${product.trend > 0 ? '+' : ''}${product.trend}%`,
          trend: product.trend >= 0 ? 'up' : 'down',
          orders: product.orders,
        });
      });
    }

    if (selectedMetrics.includes('traffic')) {
      analyticsData.trafficSources.forEach(source => {
        data.push({
          metric: `Traffic: ${source.name}`,
          value: `${source.value}%`,
          change: '-',
          trend: 'neutral',
        });
      });
    }

    if (selectedMetrics.includes('funnel')) {
      analyticsData.funnelData.forEach(stage => {
        data.push({
          metric: `Funnel: ${stage.stage}`,
          value: stage.value.toLocaleString(),
          change: `${stage.percentage}%`,
          trend: 'neutral',
        });
      });
    }

    return data;
  };

  const handleSaveReport = () => {
    if (reportName.trim() && onSaveReport) {
      onSaveReport(reportName.trim(), { metrics: selectedMetrics });
      setReportName('');
      setShowSaveDialog(false);
      onClose();
    }
  };

  const reportData = generateReportData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl mb-1">Custom Report Generator</h2>
            <p className="text-sm text-gray-600">Select metrics to include in your custom report</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Metric Selection */}
          <div className="mb-6">
            <h3 className="text-sm mb-3">Select Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableMetrics.map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`px-3 py-2 rounded-lg text-sm border-2 transition-all ${
                    selectedMetrics.includes(metric.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedMetrics.includes(metric.id) && (
                      <Plus size={14} className="rotate-45" />
                    )}
                    <span>{metric.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm">Report Preview</h3>
              <span className="text-xs text-gray-500">{reportData.length} rows</span>
            </div>
            
            {reportData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-sm">
                  Select at least one metric to generate your report
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Metric</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Value</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Change</th>
                        {reportData.some(row => row.orders) && (
                          <th className="px-4 py-3 text-left text-xs text-gray-600">Orders</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reportData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm">{row.metric}</td>
                          <td className="px-4 py-3 text-sm">{row.value}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`${
                              row.trend === 'up' ? 'text-green-600' :
                              row.trend === 'down' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {row.change}
                            </span>
                          </td>
                          {reportData.some(r => r.orders) && (
                            <td className="px-4 py-3 text-sm">{row.orders || '-'}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Close
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            disabled={reportData.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Report
          </button>
          <button
            disabled={reportData.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg mb-4">Save Custom Report</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter a name for this custom report configuration.
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

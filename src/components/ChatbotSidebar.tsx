import { X, Send, Sparkles, FileText } from 'lucide-react';
import { useState } from 'react';
import type { AnalyticsData } from '../types/analytics';

interface ChatbotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  analyticsData: AnalyticsData | null;
  onViewInDashboard?: (query: string) => void;
  onGenerateCustomReport?: (criteria?: any) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  showDashboardPrompt?: boolean;
  showReportPrompt?: boolean;
  query?: string;
  reportCriteria?: any;
}

export function ChatbotSidebar({ isOpen, onClose, analyticsData, onViewInDashboard, onGenerateCustomReport }: ChatbotSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI analytics assistant. Ask me anything about your e-commerce data, such as "What\'s my conversion rate?" or "Show me top products by revenue".',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    const userQuery = input;
    setMessages([...messages, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const { response, shouldShowDashboard, shouldShowReport, reportCriteria } = getAIResponse(userQuery, analyticsData);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        showDashboardPrompt: shouldShowDashboard,
        showReportPrompt: shouldShowReport,
        query: userQuery,
        reportCriteria,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  const getAIResponse = (query: string, data: AnalyticsData | null): { 
    response: string; 
    shouldShowDashboard: boolean;
    shouldShowReport: boolean;
    reportCriteria?: any;
  } => {
    if (!data) {
      return {
        response: 'I\'m sorry, but I don\'t have access to analytics data at the moment. Please try again later.',
        shouldShowDashboard: false,
        shouldShowReport: false,
      };
    }

    const lowerQuery = query.toLowerCase();
    let response = '';
    let shouldShowDashboard = false;
    let shouldShowReport = false;
    let reportCriteria = undefined;
    
    // Check for report generation requests
    if (lowerQuery.includes('report') || lowerQuery.includes('generate') || lowerQuery.includes('create table') || lowerQuery.includes('custom report')) {
      if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
        response = `I can generate a custom report for your revenue data. This will include revenue metrics, trends, and related KPIs in a detailed table format.`;
        shouldShowReport = true;
        reportCriteria = { metrics: ['revenue', 'orders', 'avgOrderValue'] };
      } else if (lowerQuery.includes('product')) {
        response = `I can create a custom product performance report showing your top products, revenue, orders, and trends.`;
        shouldShowReport = true;
        reportCriteria = { metrics: ['products', 'revenue', 'orders'] };
      } else if (lowerQuery.includes('traffic') || lowerQuery.includes('source')) {
        response = `I can generate a traffic sources report showing where your visitors are coming from.`;
        shouldShowReport = true;
        reportCriteria = { metrics: ['traffic'] };
      } else if (lowerQuery.includes('conversion') || lowerQuery.includes('funnel')) {
        response = `I can create a conversion funnel report showing each stage of your customer journey.`;
        shouldShowReport = true;
        reportCriteria = { metrics: ['funnel', 'conversionRate'] };
      } else {
        response = `I can generate a comprehensive custom report with all your key metrics. You can select which metrics to include.`;
        shouldShowReport = true;
        reportCriteria = { metrics: ['revenue', 'orders', 'conversionRate', 'avgOrderValue'] };
      }
    }
    // Regular query responses
    else if (lowerQuery.includes('conversion') || lowerQuery.includes('rate')) {
      response = `Your current conversion rate is ${data.kpis.conversionRate.value}, which is ${data.kpis.conversionRate.trend === 'up' ? 'up' : 'down'} ${Math.abs(data.kpis.conversionRate.change)}% compared to the last period. Consider optimizing the checkout process to improve conversions.`;
      shouldShowDashboard = true;
    } else if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
      response = `Total revenue for the selected period is ${data.kpis.revenue.value}, ${data.kpis.revenue.trend === 'up' ? 'up' : 'down'} ${Math.abs(data.kpis.revenue.change)}% from the previous period. The average order value is ${data.kpis.avgOrderValue.value}.`;
      shouldShowDashboard = true;
    } else if (lowerQuery.includes('product') || lowerQuery.includes('top')) {
      const topProduct = data.topProducts[0];
      if (topProduct) {
        response = `Your top product is ${topProduct.name} with ${topProduct.revenue} in revenue from ${topProduct.orders} orders, showing a ${Math.abs(topProduct.trend)}% ${topProduct.trend >= 0 ? 'increase' : 'decrease'}.`;
        shouldShowDashboard = true;
      } else {
        response = 'No product data available at the moment.';
      }
    } else if (lowerQuery.includes('traffic') || lowerQuery.includes('source')) {
      const topSource = data.trafficSources[0];
      if (topSource) {
        response = `${topSource.name} drives ${topSource.value}% of your traffic. Consider investing more in your top-performing channels.`;
        shouldShowDashboard = true;
      } else {
        response = 'No traffic source data available at the moment.';
      }
    } else if (lowerQuery.includes('order') && !lowerQuery.includes('average')) {
      response = `You have ${data.kpis.orders.value} orders for the selected period, ${data.kpis.orders.trend === 'up' ? 'up' : 'down'} ${Math.abs(data.kpis.orders.change)}% from the previous period.`;
      shouldShowDashboard = true;
    } else {
      response = 'I can help you analyze various metrics including revenue trends, conversion rates, top products, and traffic sources. You can also ask me to generate custom reports! What specific data would you like to explore?';
    }

    return { response, shouldShowDashboard, shouldShowReport, reportCriteria };
  };

  const handleViewInDashboard = (query: string) => {
    if (onViewInDashboard) {
      onViewInDashboard(query);
      onClose();
    }
  };

  const handleGenerateReport = (criteria?: any) => {
    if (onGenerateCustomReport) {
      onGenerateCustomReport(criteria);
    }
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white border-l border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <Sparkles size={20} className="text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm truncate">AI Analytics Assistant</h3>
            <p className="text-xs text-gray-500">Ask me anything</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'user' ? (
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-3 text-sm">
                  {msg.text}
                  
                  {msg.id === '1' && (
                    <p className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                      Also ask things like "Generate a revenue report" or "Create a custom report for products" to create reports
                    </p>
                  )}
                  
                  {/* Dashboard View Prompt */}
                  {msg.showDashboardPrompt && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">
                        Would you like to view this data in the dashboard?
                      </p>
                      <button
                        onClick={() => handleViewInDashboard(msg.query || '')}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        View in Dashboard
                      </button>
                    </div>
                  )}
                  
                  {/* Custom Report Generation Prompt */}
                  {msg.showReportPrompt && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">
                        Would you like to generate this custom report?
                      </p>
                      <button
                        onClick={() => handleGenerateReport(msg.reportCriteria)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <FileText size={12} />
                        Generate Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 border-t border-gray-100 flex-shrink-0">
        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
        <div className="space-y-1">
          {['What\'s trending?', 'Top products today', 'Traffic breakdown'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="w-full text-left text-xs px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors truncate"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm min-w-0"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
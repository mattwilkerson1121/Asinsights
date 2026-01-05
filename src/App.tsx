import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ReportsTable } from './components/ReportsTable';
import { SavedReportsView, SavedReport } from './components/SavedReportsView';
import { ChatbotSidebar } from './components/ChatbotSidebar';
import { CustomReportGenerator, ReportCriteria } from './components/CustomReportGenerator';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { generateUpdatedMockData } from './services/mockDataGenerator';
import type { AnalyticsData } from './types/analytics';

export default function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    start: '2024-11-05',
    end: '2024-12-05'
  });
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [dashboardData, setDashboardData] = useState<AnalyticsData | null>(null);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
  const [suggestedReportCriteria, setSuggestedReportCriteria] = useState<ReportCriteria | undefined>(undefined);

  // Fetch analytics data based on date range
  const { data, loading, error } = useAnalyticsData(dateRange);

  // Use dashboard data if available, otherwise use fetched data
  const displayData = dashboardData || data;

  const handleSaveReport = (reportName: string, reportDateRange: { start: string; end: string }) => {
    const newReport: SavedReport = {
      id: Date.now().toString(),
      name: reportName,
      dateRange: reportDateRange,
      savedAt: new Date(),
    };
    setSavedReports([...savedReports, newReport]);
  };

  const handleDeleteReport = (id: string) => {
    setSavedReports(savedReports.filter(report => report.id !== id));
  };

  const handleViewReport = (report: SavedReport) => {
    setDateRange(report.dateRange);
    setActiveView('my-reports');
  };

  const handleViewInDashboard = (query: string) => {
    // Switch to dashboard view
    setActiveView('dashboard');
    
    // Simulate data refresh with updated information based on query
    setIsUpdatingData(true);
    
    setTimeout(() => {
      const updatedData = generateUpdatedMockData(query, data);
      setDashboardData(updatedData);
      setIsUpdatingData(false);
    }, 800);
  };

  const handleGenerateCustomReport = (criteria?: ReportCriteria) => {
    setSuggestedReportCriteria(criteria);
    setIsCustomReportOpen(true);
    setIsChatbotOpen(false);
  };

  const handleSaveCustomReport = (reportName: string, criteria: ReportCriteria) => {
    const newReport: SavedReport = {
      id: Date.now().toString(),
      name: reportName,
      dateRange: dateRange,
      savedAt: new Date(),
    };
    setSavedReports([...savedReports, newReport]);
    setIsCustomReportOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - hidden on mobile, visible on md and up */}
      <div className="hidden md:block">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header 
          dateRange={dateRange}
          setDateRange={setDateRange}
          onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)}
          isChatbotOpen={isChatbotOpen}
          onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {activeView === 'my-reports' ? (
            <ReportsTable 
              data={displayData}
              loading={loading || isUpdatingData}
              error={error}
              dateRange={dateRange}
              onSaveReport={handleSaveReport}
            />
          ) : activeView === 'saved-reports' ? (
            <SavedReportsView
              reports={savedReports}
              onDeleteReport={handleDeleteReport}
              onViewReport={handleViewReport}
            />
          ) : (
            <Dashboard 
              data={displayData}
              loading={loading || isUpdatingData}
              error={error}
              dateRange={dateRange}
            />
          )}
        </main>
      </div>

      {/* Overlay backdrop */}
      {isChatbotOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-5 z-40 transition-opacity"
          onClick={() => setIsChatbotOpen(false)}
        />
      )}

      <ChatbotSidebar 
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        analyticsData={displayData}
        onViewInDashboard={handleViewInDashboard}
        onGenerateCustomReport={handleGenerateCustomReport}
      />

      <CustomReportGenerator
        isOpen={isCustomReportOpen}
        onClose={() => setIsCustomReportOpen(false)}
        analyticsData={displayData}
        suggestedCriteria={suggestedReportCriteria}
        onSaveReport={handleSaveCustomReport}
      />
    </div>
  );
}
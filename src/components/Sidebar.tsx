import { Home, BarChart3, FileText, Share2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ isCollapsed, onToggle, activeView, onViewChange }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('reports');

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Collapsed state - just the toggle button */}
      {isCollapsed && (
        <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-6 h-full">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Expand menu"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Expanded state - full sidebar */}
      <div 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-full ${
          isCollapsed ? 'w-0 -ml-64' : 'w-64 ml-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-red-900 text-[24px]">
            <span className="font-bold">ASI</span>nsights
          </h1>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Collapse menu"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'dashboard' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>

            <div className="pt-2">
              <button
                onClick={() => toggleMenu('reports')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileText size={20} />
                <span className="flex-1 text-left">Reports</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedMenu === 'reports' ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {expandedMenu === 'reports' && (
                <div className="ml-9 mt-1 space-y-1">
                  <button
                    onClick={() => onViewChange('my-reports')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeView === 'my-reports'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark size={16} />
                    <span>Summary</span>
                  </button>

                  <button
                    onClick={() => onViewChange('shared-reports')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeView === 'shared-reports'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Share2 size={16} />
                    <span>Shared Reports</span>
                  </button>

                  <button
                    onClick={() => onViewChange('saved-reports')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeView === 'saved-reports'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FileText size={16} />
                    <span>Saved Reports</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
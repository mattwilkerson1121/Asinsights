import { Calendar, MessageSquare, Bell, Settings, User, Menu } from 'lucide-react';

interface HeaderProps {
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  onChatbotToggle: () => void;
  isChatbotOpen: boolean;
  onMenuToggle: () => void;
}

export function Header({ dateRange, setDateRange, onChatbotToggle, isChatbotOpen, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          {/* Mobile menu button */}
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Menu size={20} />
          </button>

          <h2 className="truncate text-sm md:text-base">hello, Matt</h2>
          
          {/* Date range picker - responsive */}
          <div className="hidden sm:flex items-center gap-1 md:gap-2 bg-gray-50 rounded-lg px-2 md:px-4 py-2 border border-gray-200 text-xs md:text-sm">
            <Calendar size={16} className="text-gray-500 hidden md:block" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-transparent border-none outline-none w-24 md:w-auto"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-transparent border-none outline-none w-24 md:w-auto"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <button
            onClick={onChatbotToggle}
            className={`p-2 rounded-lg transition-colors ${
              isChatbotOpen 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="AI Assistant"
          >
            <MessageSquare size={18} className="md:w-5 md:h-5" />
          </button>
          
          <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <Bell size={18} className="md:w-5 md:h-5" />
          </button>
          
          <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <Settings size={18} className="md:w-5 md:h-5" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <User size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Mobile date picker - shown below on small screens */}
      <div className="sm:hidden mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 text-xs">
        <Calendar size={14} className="text-gray-500" />
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          className="bg-transparent border-none outline-none flex-1"
        />
        <span className="text-gray-400">-</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          className="bg-transparent border-none outline-none flex-1"
        />
      </div>
    </header>
  );
}
import { Trash2, Eye, Calendar } from 'lucide-react';

export interface SavedReport {
  id: string;
  name: string;
  dateRange: {
    start: string;
    end: string;
  };
  savedAt: Date;
}

interface SavedReportsViewProps {
  reports: SavedReport[];
  onDeleteReport: (id: string) => void;
  onViewReport: (report: SavedReport) => void;
}

export function SavedReportsView({ reports, onDeleteReport, onViewReport }: SavedReportsViewProps) {
  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl mb-2">Saved Reports</h2>
        <p className="text-sm text-gray-600">Manage your saved report configurations</p>
      </div>

      {/* Reports Grid */}
      {reports.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No saved reports yet</p>
            <p className="text-sm text-gray-500">
              Go to My Reports and click "Save Report" to create your first saved report
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-1 truncate">{report.name}</h3>
                  <p className="text-xs text-gray-500">
                    Saved {new Date(report.savedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-2 mb-3">
                <p className="text-xs text-gray-600 mb-1">Date Range:</p>
                <p className="text-xs">
                  {report.dateRange.start} to {report.dateRange.end}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onViewReport(report)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => onDeleteReport(report.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

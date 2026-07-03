import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { formatDate } from '../utils/formatDate';
import { fetchSchedulerLogs } from '../api/schedulerApi';

const SchedulerLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSchedulerLogs({ page, limit: 20 });
      setLogs(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scheduler Logs</h2>
        <button
          onClick={loadLogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
        {error && (
          <div className="p-4 m-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No scheduler logs yet</p>
            <p className="text-sm mt-1">Logs appear after scheduler runs</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Started At</th>
                    <th className="px-4 py-3 font-medium">Ended At</th>
                    <th className="px-4 py-3 font-medium">Duration</th>
                    <th className="px-4 py-3 font-medium">Checked</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <td className="px-4 py-3 dark:text-gray-200">{formatDate(log.startedAt)}</td>
                      <td className="px-4 py-3 dark:text-gray-200">{formatDate(log.endedAt)}</td>
                      <td className="px-4 py-3 dark:text-gray-300">
                        {Math.round(
                          (new Date(log.endedAt) - new Date(log.startedAt)) / 1000
                        )}{' '}
                        s
                      </td>
                      <td className="px-4 py-3 dark:text-gray-300">{log.checkedOrders}</td>
                      <td className="px-4 py-3 dark:text-gray-300">{log.updatedOrders}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {log.errorMessage || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default SchedulerLogs;

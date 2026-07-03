import { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import OrderTable from '../components/OrderTable';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { useToast } from '../context/ToastContext';
import { fetchOrderStats, fetchOrders, updateOrder, deleteOrder } from '../api/orderApi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 5 });
  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetchOrderStats(),
        fetchOrders(params),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.orders);
      setPagination(ordersRes.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrder(id, { orderStatus: newStatus });
      addToast('Order status updated', 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteOrder(id);
      addToast('Order deleted', 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSearch = (query) => {
    setParams((prev) => ({ ...prev, search: query, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>

      <StatsCards stats={stats} />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="p-4 m-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <OrderTable
              orders={orders}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

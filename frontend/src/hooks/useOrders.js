import { useState, useEffect, useCallback } from 'react';
import { fetchOrders as getOrders } from '../api/orderApi';

export const useOrders = (initialParams = {}) => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrders(params);
      setOrders(result.orders);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return { orders, pagination, loading, error, params, setParams, refetch: loadOrders };
};

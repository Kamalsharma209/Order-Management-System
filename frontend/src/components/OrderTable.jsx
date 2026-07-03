import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

const OrderTable = ({ orders, onStatusChange, onDelete }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No orders found</p>
        <p className="text-sm mt-1">Create an order to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3 font-medium">Order ID</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                {order.orderId}
              </td>
              <td className="px-4 py-3 font-medium dark:text-gray-200">{order.customerName}</td>
              <td className="px-4 py-3 dark:text-gray-300">{order.phoneNumber}</td>
              <td className="px-4 py-3 dark:text-gray-300">{order.productName}</td>
              <td className="px-4 py-3 dark:text-gray-200">₹{order.amount.toLocaleString()}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${ORDER_STATUS_COLORS[order.orderStatus]}`}
                >
                  <option value="PLACED">PLACED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="READY_TO_SHIP">READY TO SHIP</option>
                </select>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                {formatDate(order.updatedAt)}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(order._id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

const StatCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { label: 'Total Orders', value: stats.total, color: 'text-gray-900 dark:text-white' },
    { label: 'Placed', value: stats.placed, color: 'text-blue-600' },
    { label: 'Processing', value: stats.processing, color: 'text-yellow-600' },
    { label: 'Ready to Ship', value: stats.readyToShip, color: 'text-green-600' },
    { label: 'Paid', value: stats.paid, color: 'text-green-600' },
    { label: 'Pending Payment', value: stats.pending, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;

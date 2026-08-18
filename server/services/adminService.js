const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * Get dashboard statistics for admin
 */
const getStats = async () => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueData,
    statusBreakdown,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    User.countDocuments({ role: 'consumer' }),
    Product.countDocuments(),
    Order.countDocuments(),
    // Calculate total revenue from paid/completed orders
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]),
    // Orders grouped by status
    Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]),
    // 5 most recent orders
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5),
    // Products with stock < 10
    Product.countDocuments({ stock: { $lt: 10 } }),
  ]);

  const totalSales = revenueData.length > 0 ? revenueData[0].totalSales : 0;

  // Format status breakdown into object
  const statusCounts = {
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  statusBreakdown.forEach((item) => {
    statusCounts[item._id] = item.count;
  });

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalSales,
    statusCounts,
    recentOrders,
    lowStockProducts,
  };
};

module.exports = {
  getStats,
};

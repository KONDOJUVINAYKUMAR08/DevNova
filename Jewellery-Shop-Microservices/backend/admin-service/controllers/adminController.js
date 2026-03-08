const axios = require('axios');

const SERVICES = {
  user: process.env.USER_SERVICE_URL || 'http://user-service:4001',
  product: process.env.PRODUCT_SERVICE_URL || 'http://product-service:4002',
  rate: process.env.RATE_SERVICE_URL || 'http://rate-service:4003',
  order: process.env.ORDER_SERVICE_URL || 'http://order-service:4004',
  review: process.env.REVIEW_SERVICE_URL || 'http://review-service:4005'
};

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const headers = { Authorization: token };

    const [usersRes, productsRes, ordersRes, reviewsRes, ratesRes] = await Promise.allSettled([
      axios.get(`${SERVICES.user}/api/users?limit=1`, { headers }),
      axios.get(`${SERVICES.product}/api/products?limit=1`),
      axios.get(`${SERVICES.order}/api/orders/stats`, { headers }),
      axios.get(`${SERVICES.review}/api/reviews/stats`, { headers }),
      axios.get(`${SERVICES.rate}/api/rates`)
    ]);

    const dashboard = {
      users: {
        total: usersRes.status === 'fulfilled' ? usersRes.value.data.total : 0
      },
      products: {
        total: productsRes.status === 'fulfilled' ? productsRes.value.data.total : 0
      },
      orders: ordersRes.status === 'fulfilled' ? ordersRes.value.data : { totalOrders: 0, pendingOrders: 0, totalRevenue: 0 },
      reviews: reviewsRes.status === 'fulfilled' ? reviewsRes.value.data : { totalReviews: 0, averageRating: 0 },
      rates: ratesRes.status === 'fulfilled' ? ratesRes.value.data : []
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

// GET /api/admin/health-check
exports.healthCheck = async (req, res) => {
  try {
    const checks = await Promise.allSettled([
      axios.get(`${SERVICES.user}/health`),
      axios.get(`${SERVICES.product}/health`),
      axios.get(`${SERVICES.rate}/health`),
      axios.get(`${SERVICES.order}/health`),
      axios.get(`${SERVICES.review}/health`)
    ]);

    const services = ['user-service', 'product-service', 'rate-service', 'order-service', 'review-service'];
    const status = services.map((name, i) => ({
      service: name,
      status: checks[i].status === 'fulfilled' ? 'healthy' : 'down',
      data: checks[i].status === 'fulfilled' ? checks[i].value.data : null
    }));

    res.json({ services: status });
  } catch (error) {
    res.status(500).json({ message: 'Error checking services', error: error.message });
  }
};

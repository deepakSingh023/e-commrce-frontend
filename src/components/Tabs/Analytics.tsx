const express = require('express');
const router = express.Router();
const { 
  getSalesData,
  getOrderAnalytics,
  getProductAnalytics,
  getCustomerAnalytics
} = require('../controllers/analyticsController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.get('/sales', auth, admin, getSalesData);
router.get('/orders', auth, admin, getOrderAnalytics);
router.get('/products', auth, admin, getProductAnalytics);
router.get('/customers', auth, admin, getCustomerAnalytics);

module.exports = router;
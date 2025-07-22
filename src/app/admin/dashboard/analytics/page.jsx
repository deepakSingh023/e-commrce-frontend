
"use client"
import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, 
  Box, CircularProgress, Paper, Container
} from '@mui/material';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    sales: null,
    orders: null,
    products: null,
    customers: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, ordersRes, productsRes, customersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/analytics/sales'),
          axios.get('http://localhost:5000/api/analytics/orders'),
          axios.get('http://localhost:5000/api/analytics/products'),
          axios.get('http://localhost:5000/api/analytics/customers')
        ]);

        setData({
          sales: salesRes.data,
          orders: ordersRes.data,
          products: productsRes.data,
          customers: customersRes.data,
          loading: false
        });
      } catch (error) {
        setData({
          ...data,
          error: 'Failed to fetch analytics data',
          loading: false
        });
      }
    };

    fetchData();
  }, []);

  if (data.loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.error) {
    return <Typography color="error">{data.error}</Typography>;
  }

  // Data processing functions
  const getStatusColors = (status) => {
    const colors = {
      'Pending': '#FFC107',
      'Processing': '#2196F3',
      'Shipped': '#9C27B0',
      'Delivered': '#4CAF50',
      'Cancelled': '#F44336'
    };
    return colors[status] || '#8884d8';
  };

  // Sales Summary Card
  const SalesSummaryCard = () => (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Sales Summary</Typography>
        <Typography variant="h4" color="primary">
          ${(data.sales?.totalSales || 0).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Total Revenue
        </Typography>
        
        <Box mt={3}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.sales?.salesByDate || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#8884d8" 
                name="Daily Sales"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  // Order Stats Card
  const OrderStatsCard = () => {
    const statusData = data.orders?.orderStatus || [];
    
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Order Statistics</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="_id"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColors(entry._id)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
                {statusData.map((status) => (
                  <Box key={status._id} display="flex" alignItems="center" mb={1}>
                    <Box 
                      width={12} 
                      height={12} 
                      bgcolor={getStatusColors(status._id)} 
                      mr={1} 
                      borderRadius="50%"
                    />
                    <Typography variant="body2">
                      {status._id}: {status.count}
                    </Typography>
                  </Box>
                ))}
                <Box mt={2}>
                  <Typography variant="body2">
                    Avg. Order Value: ${(data.orders?.avgOrderValue || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Product Performance Card
  const ProductPerformanceCard = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Product Performance</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Top Selling Products</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={data.products?.topProducts || []}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSold" name="Units Sold" fill="#82ca9d" />
                <Bar dataKey="totalRevenue" name="Revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Low Stock Alert</Typography>
            {data.products?.lowStock?.map((product) => (
              <Paper key={product._id} sx={{ p: 2, mb: 1 }}>
                <Grid container alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="body1">{product.name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography 
                      variant="body1" 
                      color={product.stock < 5 ? 'error' : 'warning.main'}
                    >
                      Stock: {product.stock}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>Top Rated Products</Typography>
              {data.products?.topRated?.map((product) => (
                <Box key={product._id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">{product.name}</Typography>
                  <Typography variant="body2">Rating: {product.avgRating.toFixed(1)}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Customer Insights Card
  const CustomerInsightsCard = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Customer Insights</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Top Customers</Typography>
            {data.customers?.topCustomers?.map((customer, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body1" fontWeight="bold">{customer.name}</Typography>
                <Typography variant="body2">{customer.email}</Typography>
                <Typography variant="body2">
                  Spent: ${customer.totalSpent.toFixed(2)} | Orders: {customer.orderCount}
                </Typography>
              </Box>
            ))}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Customer Locations</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.customers?.customerLocations || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Orders" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
            
            <Box mt={2}>
              <Typography variant="body2">
                New Customers (30 days): {data.customers?.newCustomers}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Main Sales Card */}
        <Grid item xs={12} md={8}>
          <SalesSummaryCard />
        </Grid>
        
        {/* Order Stats Card */}
        <Grid item xs={12} md={4}>
          <OrderStatsCard />
        </Grid>
        
        {/* Product Performance */}
        <Grid item xs={12}>
          <ProductPerformanceCard />
        </Grid>
        
        {/* Customer Insights */}
        <Grid item xs={12}>
          <CustomerInsightsCard />
        </Grid>
        
        {/* Additional Cards */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.sales?.salesByCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" name="Revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Orders Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.orders?.ordersByDate || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#82ca9d" 
                    name="Daily Orders"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;
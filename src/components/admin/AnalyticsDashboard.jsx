"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Star,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  PieChartIcon,
  Activity,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  PieChart,
} from "recharts"

export default function AnalyticsDashboard() {
  const [data, setData] = useState({
    sales: null,
    orders: null,
    products: null,
    customers: null,
    loading: true,
    error: null,
  })

  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")

  // Enhanced mock data
  const mockData = {
    sales: {
      totalSales: 12560.75,
      salesByDate: [
        { _id: "Jun 01", total: 450, count: 8, growth: 5.2 },
        { _id: "Jun 02", total: 780, count: 12, growth: 8.1 },
        { _id: "Jun 03", total: 920, count: 15, growth: 12.3 },
        { _id: "Jun 04", total: 640, count: 10, growth: -2.1 },
        { _id: "Jun 05", total: 1120, count: 18, growth: 15.7 },
        { _id: "Jun 06", total: 890, count: 14, growth: 3.4 },
        { _id: "Jun 07", total: 1320, count: 20, growth: 18.9 },
      ],
      salesByCategory: [
        { _id: "Electronics", total: 5200, count: 45, percentage: 41.4 },
        { _id: "Clothing", total: 3800, count: 62, percentage: 30.2 },
        { _id: "Home & Kitchen", total: 2100, count: 28, percentage: 16.7 },
        { _id: "Books", total: 980, count: 22, percentage: 7.8 },
        { _id: "Beauty", total: 1480, count: 18, percentage: 11.8 },
      ],
    },
    orders: {
      orderStatus: [
        { _id: "Pending", count: 12, color: "#f59e0b" },
        { _id: "Processing", count: 8, color: "#3b82f6" },
        { _id: "Shipped", count: 15, color: "#8b5cf6" },
        { _id: "Delivered", count: 42, color: "#10b981" },
        { _id: "Cancelled", count: 3, color: "#ef4444" },
      ],
      avgOrderValue: 125.6,
      ordersByDate: [
        { _id: "Jun 01", count: 8, revenue: 1200 },
        { _id: "Jun 02", count: 12, revenue: 1800 },
        { _id: "Jun 03", count: 15, revenue: 2250 },
        { _id: "Jun 04", count: 10, revenue: 1500 },
        { _id: "Jun 05", count: 18, revenue: 2700 },
        { _id: "Jun 06", count: 14, revenue: 2100 },
        { _id: "Jun 07", count: 20, revenue: 3000 },
      ],
    },
    products: {
      topProducts: [
        { _id: "1", name: "Wireless Headphones", totalSold: 42, totalRevenue: 3360, trend: "up" },
        { _id: "2", name: "Smart Watch", totalSold: 28, totalRevenue: 8400, trend: "up" },
        { _id: "3", name: "Running Shoes", totalSold: 35, totalRevenue: 3150, trend: "down" },
        { _id: "4", name: "Bluetooth Speaker", totalSold: 19, totalRevenue: 2850, trend: "up" },
        { _id: "5", name: "E-Reader", totalSold: 22, totalRevenue: 3300, trend: "stable" },
      ],
      lowStock: [
        { _id: "101", name: "Gaming Mouse", stock: 3, price: 49.99, category: "Electronics" },
        { _id: "102", name: "Mechanical Keyboard", stock: 5, price: 89.99, category: "Electronics" },
        { _id: "103", name: "Noise Cancelling Headphones", stock: 2, price: 199.99, category: "Electronics" },
        { _id: "104", name: "Fitness Tracker", stock: 7, price: 79.99, category: "Health" },
        { _id: "105", name: "Portable Charger", stock: 4, price: 39.99, category: "Electronics" },
      ],
      topRated: [
        { _id: "201", name: "Coffee Maker", avgRating: 4.8, reviewCount: 24, category: "Kitchen" },
        { _id: "202", name: "Electric Toothbrush", avgRating: 4.7, reviewCount: 32, category: "Health" },
        { _id: "203", name: "Air Fryer", avgRating: 4.9, reviewCount: 18, category: "Kitchen" },
        { _id: "204", name: "Robot Vacuum", avgRating: 4.6, reviewCount: 15, category: "Home" },
        { _id: "205", name: "Smart Thermostat", avgRating: 4.7, reviewCount: 21, category: "Home" },
      ],
    },
    customers: {
      topCustomers: [
        {
          name: "Alex Johnson",
          email: "alex.j@example.com",
          totalSpent: 2450.75,
          orderCount: 8,
          lastOrder: "2 days ago",
        },
        {
          name: "Sarah Williams",
          email: "sarah.w@example.com",
          totalSpent: 1890.5,
          orderCount: 6,
          lastOrder: "1 week ago",
        },
        {
          name: "Michael Brown",
          email: "michael.b@example.com",
          totalSpent: 1675.25,
          orderCount: 5,
          lastOrder: "3 days ago",
        },
        {
          name: "Emily Davis",
          email: "emily.d@example.com",
          totalSpent: 1420.0,
          orderCount: 4,
          lastOrder: "5 days ago",
        },
        {
          name: "David Miller",
          email: "david.m@example.com",
          totalSpent: 1325.5,
          orderCount: 7,
          lastOrder: "1 day ago",
        },
      ],
      customerLocations: [
        { _id: "New York", count: 28, revenue: 45600 },
        { _id: "Los Angeles", count: 22, revenue: 38200 },
        { _id: "Chicago", count: 18, revenue: 29800 },
        { _id: "Houston", count: 15, revenue: 24500 },
        { _id: "Miami", count: 12, revenue: 19200 },
      ],
      newCustomers: 42,
      customerGrowth: [
        { month: "Jan", new: 25, returning: 45 },
        { month: "Feb", new: 32, returning: 52 },
        { month: "Mar", new: 28, returning: 48 },
        { month: "Apr", new: 35, returning: 58 },
        { month: "May", new: 42, returning: 65 },
        { month: "Jun", new: 38, returning: 62 },
      ],
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay with loading animation
        setTimeout(() => {
          setData({
            sales: mockData.sales,
            orders: mockData.orders,
            products: mockData.products,
            customers: mockData.customers,
            loading: false,
            error: null,
          })
        }, 1500)
      } catch (error) {
        setData((prev) => ({
          ...prev,
          error: "Failed to fetch analytics data",
          loading: false,
        }))
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      Pending: "hsl(var(--chart-1))",
      Processing: "hsl(var(--chart-2))",
      Shipped: "hsl(var(--chart-3))",
      Delivered: "hsl(var(--chart-4))",
      Cancelled: "hsl(var(--chart-5))",
    }
    return colors[status] || "hsl(var(--chart-1))"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const SummaryCards = () => {
    const summaryData = [
      {
        title: "Total Revenue",
        value: `$${data.sales?.totalSales?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}`,
        icon: <DollarSign className="h-6 w-6" />,
        change: "+12.5%",
        changeType: "positive",
        description: "vs last month",
        gradient: "from-emerald-500 to-teal-600",
        bgGradient: "from-emerald-50 to-teal-50",
        darkBgGradient: "from-emerald-950/20 to-teal-950/20",
      },
      {
        title: "Total Orders",
        value: data.orders?.orderStatus?.reduce((sum, status) => sum + status.count, 0) || 0,
        icon: <ShoppingCart className="h-6 w-6" />,
        change: "+8.3%",
        changeType: "positive",
        description: "vs last month",
        gradient: "from-blue-500 to-indigo-600",
        bgGradient: "from-blue-50 to-indigo-50",
        darkBgGradient: "from-blue-950/20 to-indigo-950/20",
      },
      {
        title: "New Customers",
        value: data.customers?.newCustomers || 0,
        icon: <Users className="h-6 w-6" />,
        change: "+5.2%",
        changeType: "positive",
        description: "vs last month",
        gradient: "from-purple-500 to-pink-600",
        bgGradient: "from-purple-50 to-pink-50",
        darkBgGradient: "from-purple-950/20 to-pink-950/20",
      },
      {
        title: "Avg. Order Value",
        value: `$${data.orders?.avgOrderValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}`,
        icon: <TrendingUp className="h-6 w-6" />,
        change: "+3.7%",
        changeType: "positive",
        description: "vs last month",
        gradient: "from-orange-500 to-red-600",
        bgGradient: "from-orange-50 to-red-50",
        darkBgGradient: "from-orange-950/20 to-red-950/20",
      },
    ]

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
      >
        {summaryData.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            className="group"
          >
            <Card
              className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${item.bgGradient} dark:${item.darkBgGradient} hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent" />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground/80">{item.title}</p>
                      <div
                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {item.icon}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl lg:text-3xl font-bold tracking-tight">{item.value}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {item.change}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    )
  }

  const SalesChart = () => (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Sales Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Daily sales performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8 bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Last 7 days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer
            config={{
              total: {
                label: "Daily Sales",
                color: "hsl(var(--chart-1))",
              },
              count: {
                label: "Orders",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[350px]"
          >
            <AreaChart data={data.sales?.salesByDate || []}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="_id" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <ChartTooltip
                content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border shadow-lg" />}
              />
              <Area
                dataKey="total"
                type="natural"
                fill="url(#fillTotal)"
                fillOpacity={0.6}
                stroke="var(--color-total)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--color-total)" }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )

  const OrderStatusChart = () => (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-secondary/5 to-secondary/10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-white">
              <PieChartIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Order Status</CardTitle>
              <p className="text-sm text-muted-foreground">Current order distribution</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 ">
            <ChartContainer
              config={{
                Pending: { label: "Pending", color: "hsl(var(--chart-1))" },
                Processing: { label: "Processing", color: "hsl(var(--chart-2))" },
                Shipped: { label: "Shipped", color: "hsl(var(--chart-3))" },
                Delivered: { label: "Delivered", color: "hsl(var(--chart-4))" },
                Cancelled: { label: "Cancelled", color: "hsl(var(--chart-5))" },
              }}
              className="h-[250px]"
            >
              <PieChart>
                <Pie
                  data={data.orders?.orderStatus || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="count"
                  nameKey="_id"
                  strokeWidth={2}
                >
                  {data.orders?.orderStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry._id)} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="space-y-3">
              {data.orders?.orderStatus?.map((status, index) => (
                <motion.div
                  key={status._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(status._id) }} />
                    <span className="font-medium">{status._id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="font-semibold">
                      {status.count}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {(
                        (status.count / (data.orders?.orderStatus?.reduce((sum, s) => sum + s.count, 0) || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const ProductPerformance = () => (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-500/5 to-teal-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Product Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Top products and inventory alerts</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Top Selling Products Chart */}
            <div className="xl:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                Top Selling Products
              </h3>
              <ChartContainer
                config={{
                  totalRevenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={data.products?.topProducts || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis axisLine={false} tickLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="totalRevenue"
                    fill="var(--color-totalRevenue)"
                    radius={[6, 6, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Side Panels */}
            <div className="space-y-6">
              {/* Low Stock Alert */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Low Stock Alert
                </h3>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {data.products?.lowStock?.slice(0, 4).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                          <Badge variant={product.stock < 5 ? "destructive" : "secondary"} className="text-xs">
                            {product.stock < 5 && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {product.stock}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Top Rated Products */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Top Rated
                </h3>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {data.products?.topRated?.slice(0, 4).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.reviewCount} reviews</p>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-950/20 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{product.avgRating.toFixed(1)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const CustomerInsights = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Customer Insights</CardTitle>
              <p className="text-sm text-muted-foreground">Customer analytics and demographics</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Top Customers */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Top Customers
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {data.customers?.topCustomers?.map((customer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold truncate">{customer.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="font-semibold">${customer.totalSpent.toFixed(0)}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="font-semibold">{customer.orderCount}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground">Last Order</p>
                        <p className="font-semibold text-xs">{customer.lastOrder}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Customer Locations & Growth */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  Customer Locations
                </h3>
                <ChartContainer
                  config={{
                    count: {
                      label: "Orders",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <BarChart data={data.customers?.customerLocations || []}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} className="text-xs" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="var(--color-count)"
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ChartContainer>
              </div>

              {/* Customer Growth Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 text-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-2">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">New Customers</p>
                  <p className="text-2xl font-bold text-emerald-600">{data.customers?.newCustomers || 0}</p>
                  <p className="text-xs text-emerald-600">+15% this month</p>
                </div>
                <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 text-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-2">
                    <Activity className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Repeat Rate</p>
                  <p className="text-2xl font-bold text-blue-600">72.5%</p>
                  <p className="text-xs text-blue-600">+3% this month</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const AdditionalCharts = () => (
    <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales by Category */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-orange-500/5 to-red-500/10">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Sales by Category</CardTitle>
                <p className="text-sm text-muted-foreground">Revenue breakdown by product category</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer
              config={{
                total: {
                  label: "Revenue",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={data.sales?.salesByCategory || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="total"
                  fill="var(--color-total)"
                  radius={[6, 6, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Trend */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-500/5 to-pink-500/10">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Orders Trend</CardTitle>
                <p className="text-sm text-muted-foreground">Daily order volume over time</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer
              config={{
                count: {
                  label: "Daily Orders",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={data.orders?.ordersByDate || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "var(--color-count)" }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )

  if (data.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 lg:p-6">
        <div className="w-full max-w-none mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 lg:col-span-2" />
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-destructive">Error Loading Data</h2>
          <p className="text-muted-foreground">{data.error}</p>
          <p className="text-sm text-muted-foreground">
            Please try again later or contact support if the problem persists.
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full p-4 lg:p-6 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg mt-2">
                Comprehensive insights into your e-commerce performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
              <Button size="sm">Export Report</Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Main Charts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div>
            <OrderStatusChart />
          </div>
        </motion.div>

        {/* Product Performance */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <ProductPerformance />
        </motion.div>

        {/* Customer Insights */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <CustomerInsights />
        </motion.div>

        {/* Additional Charts */}
        <AdditionalCharts />
      </div>
    </div>
  )
}

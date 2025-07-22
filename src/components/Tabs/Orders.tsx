"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Package, Trash2, AlertCircle } from "lucide-react"
import API from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function Orders() {
  const [Orders, setOrders] = useState<TransformedOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
  
  // Type for the transformed order data
  type TransformedOrder = {
    id: string
    orderId: string
    date: string
    total: number
    status: string
    trackingNumber?: string | null
    estimatedDelivery?: string | null
    items: {
      name: string
      quantity: number
      price: number
      image: string
    }[]
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken') // Adjust based on your auth implementation
      if (!token) {
        setError('Please log in to view orders')
        setLoading(false)
        return
      }

      const res = await API.get("/orders/getAllOrders")
      
      // The API returns data directly as an array
      const rawOrders = res.data
      
      console.log('Raw orders from API:', rawOrders)
      
      if (Array.isArray(rawOrders)) {
        // Transform the backend data to match frontend interface
        const transformedOrders = rawOrders.map(order => ({
          id: order._id,
          orderId: order.orderId,
          date: order.createdAt,
          total: order.totalPrice,
          status: order.status.toLowerCase(), // Convert "Pending" to "pending"
          trackingNumber: order.trackingNumber || null,
          estimatedDelivery: order.estimatedDelivery || null,
          items: order.orderItems.map((item: any) => ({
            name: item.name,
            quantity: item.qty,
            price: item.price,
            image: item.image
          }))
        }))
        
        setOrders(transformedOrders)
        console.log('Transformed orders:', transformedOrders)
      } else {
        setError('Invalid response format')
      }
    } catch (err: any) {
      console.error("Error fetching orders", err)
      
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again')
      } else if (err.response?.status === 403) {
        setError('Access denied: Insufficient permissions')
      } else {
        setError(err.response?.data?.message || 'Failed to fetch orders')
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteOrder = async (id: string) => {
    try {
      await API.delete(`/admin/deleteOrder/${id}`)
      setOrders((prev) => prev.filter((order) => order.id !== id))
    } catch (err: any) {
      console.error("Error deleting order:", err)
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again')
      }
    }
  }

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await API.patch(`/admin/updateOrderStatus`, { status: newStatus, orderId: id })
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      )
    } catch (err: any) {
      console.error("Error updating order status:", err)
      if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again')
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Orders</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchOrders} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">Order Management</h1>
            <p className="text-gray-600">Manage your order catalog</p>
          </div>

          {/* Order Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">All Orders ({Orders.length})</h2>
              <div className="space-x-2">
                <Button onClick={fetchOrders} variant="outline" size="sm">
                  Refresh
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      const res = await API.get("/admin/getAllOrders")
                      console.log('Admin endpoint response:', res.data)
                    } catch (err) {
                      console.log('Admin endpoint error:', err)
                    }
                  }} 
                  variant="outline" 
                  size="sm"
                >
                  Try Admin Endpoint
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {Orders.length > 0 ? (
                Orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Order ID: {order.orderId}
                        </h3>
                        <Badge
                          className={`${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteOrder(order.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3 mt-2">
                      <div>
                        <strong>Date:</strong>{" "}
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div>
                        <strong>Total:</strong> ₹{order.total}
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <strong>Tracking #:</strong> {order.trackingNumber}
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div>
                          <strong>Est. Delivery:</strong> {order.estimatedDelivery}
                        </div>
                      )}
                      {/* Status Dropdown */}
                      <div>
                        <strong>Change Status:</strong>{" "}
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-4">
                      <strong className="text-sm text-gray-700">Items:</strong>
                      <div className="grid gap-3 mt-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 border rounded p-2 bg-gray-50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded border"
                            />
                            <div className="text-sm text-gray-800">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                Qty: {item.quantity} × ₹{item.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Package, Trash2 } from "lucide-react"
import API from "@/lib/api"
import { FrontOrders } from "@/app/orders/page"
import { Button } from "@/components/ui/button"

export default function Orders() {
  const [Orders, setOrders] = useState<FrontOrders[]>([])
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/getAllOrders")
      setOrders(res.data.orders || [])
    } catch (err) {
      console.error("Error fetching orders", err)
    }
  }

  const deleteOrder = async (id: string) => {
    try {
      await API.delete(`/admin/deleteOrder/${id}`);

      setOrders((prev) => prev.filter((order) => order.id !== id))
    } catch (err) {
      console.error("Error deleting order:", err)
    }
  }

  const updateOrderStatus = async (id: string, newStatus: FrontOrders["status"]) => {
    try {
      await API.patch(`/admin/updateOrderStatus`, { status: newStatus, orderId: id })
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      )
    } catch (err) {
      console.error("Error updating order status:", err)
    }
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
            <h2 className="text-lg font-semibold mb-4">All Orders ({Orders.length})</h2>

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
                            updateOrderStatus(order.id, e.target.value as FrontOrders["status"])
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

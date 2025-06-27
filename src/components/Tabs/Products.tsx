"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Package, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import API from "@/lib/api"
import CreateProduct from "./CreateProduct"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  category: string
  size: string[]
  stock: number
  inStock: boolean
  featuredAt: boolean
  images: string[]
  features: string[]
}

export default function Products() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await API.get('products/getAllProducts')
      setProducts(res.data || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      })
    }
  }

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return
    try {
      await API.delete(`admin/deleteProduct/${productId}`)
      fetchProducts()
      toast({
        title: "Product deleted!",
        description: `${productName} has been removed`
      })
    } catch (err) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Product Management</h1>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
              <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                <Plus className="w-4 h-4 mr-2" />
                {showCreateForm ? "Cancel" : "Create Product"}
              </Button>
            </div>
          </div>

          {showCreateForm && (
            <div className="p-6 border-b">
              <CreateProduct
                fetchProducts={fetchProducts}
                setShowCreateForm={setShowCreateForm}
              />
            </div>
          )}

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">All Products ({products.length})</h2>

            <div className="space-y-4">
              {products.length > 0 ? (
                products.map(product => (
                  <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          {product.featuredAt && <Badge className="bg-green-100 text-green-800">Featured</Badge>}
                          <Badge variant={product.inStock ? "default" : "destructive"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div><strong>Price:</strong> ₹{product.price}</div>
                          <div><strong>Category:</strong> {product.category}</div>
                          <div><strong>Size:</strong> {product.size}</div>
                          <div><strong>Stock:</strong> {product.stock}</div>
                        </div>

                        <p className="text-gray-700 mb-2">{product.description}</p>

                        {Array.isArray(product.features) && product.features.length > 0 && (
                          <div className="mb-2">
                            <strong className="text-sm">Features:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.features.map((feature, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {Array.isArray(product.images) && product.images.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {product.images.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                className="w-12 h-12 object-cover rounded border"
                              />
                            ))}
                            {product.images.length > 3 && (
                              <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs">
                                +{product.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product._id, product.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No products found. Create your first product!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

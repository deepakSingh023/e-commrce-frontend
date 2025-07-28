"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import API from "@/lib/api"
import { X, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  fetchProducts: () => void
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>
}

// Available categories from the products page
const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion", 
  "Home",
  "Audio",
  "Accessories"
]

export default function CreateProduct({ fetchProducts, setShowCreateForm }: Props) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState<number | "">("")
  const [inStock, setInStock] = useState(true)
  const [featuredAt, setFeaturedAt] = useState(false)

  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState("")

  const [sizes, setSizes] = useState<string[]>([])
  const [sizeInput, setSizeInput] = useState("")

  const [images, setImages] = useState<File[]>([])

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput("")
    }
  }

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setSizes([...sizes, sizeInput.trim()])
      setSizeInput("")
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 4) {
      toast.error("Maximum 4 images allowed")
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const handleRemoveImage = (index: number) => {
    const updated = [...images]
    updated.splice(index, 1)
    setImages(updated)
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index))
  }

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async () => {
    if (!name || !description || price === "" || !category || stock === "") {
      toast.error("Please fill in all required fields")
      return
    }

    if (images.length === 0) {
      toast.error("Please add at least one product image")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", String(price))
    formData.append("category", category)
    formData.append("stock", String(stock))
    formData.append("inStock", String(inStock))
    formData.append("featuredAt", String(featuredAt))

    features.forEach(f => formData.append("features", f))
    sizes.forEach(s => formData.append("size", s))
    images.forEach(img => formData.append("images", img))

    try {
      await API.post("/admin/createProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success("Product added successfully")
      fetchProducts()
      setShowCreateForm(false)
    } catch (err: any) {
      console.error("Create error:", err)
      toast.error(err?.response?.data?.message || "Failed to create product")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Product</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            placeholder="Enter product description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              min="0"
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <Label>Sizes (Optional)</Label>
          <div className="flex gap-2">
            <Input
              value={sizeInput}
              onChange={e => setSizeInput(e.target.value)}
              placeholder="e.g., S, M, L, XL"
              onKeyPress={e => e.key === 'Enter' && handleAddSize()}
            />
            <Button onClick={handleAddSize} type="button" variant="outline">
              Add Size
            </Button>
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {size}
                  <button
                    onClick={() => handleRemoveSize(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label>Features (Optional)</Label>
          <div className="flex gap-2">
            <Input
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              placeholder="e.g., Waterproof, Wireless, Fast charging"
              onKeyPress={e => e.key === 'Enter' && handleAddFeature()}
            />
            <Button onClick={handleAddFeature} type="button" variant="outline">
              Add Feature
            </Button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {feature}
                  <button
                    onClick={() => handleRemoveFeature(index)}
                    className="text-blue-600 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="space-y-3">
          <Label>Product Images * (Max 4 images)</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="cursor-pointer"
          />
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative border rounded-lg aspect-square overflow-hidden group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <Label>Product Settings</Label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={inStock}
                onCheckedChange={(checked) => setInStock(checked as boolean)}
              />
              <Label htmlFor="inStock" className="cursor-pointer">
                Available in Stock
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={featuredAt}
                onCheckedChange={(checked) => setFeaturedAt(checked as boolean)}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured Product
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleSubmit} className="flex-1 sm:flex-none">
            Create Product
          </Button>
          <Button
            onClick={() => setShowCreateForm(false)}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
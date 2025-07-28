import React from 'react';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Product } from './Products';
import { toast } from "react-hot-toast"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>
  product: Product
}

// Available categories from the products page
const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion", 
  "Home",
  "Audio",
  "Accessories"
]

export default function EditProduct({ setShowEditForm, product }: Props){

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
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([])
  const [images, setImages] = useState<File[]>([])

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description)
      setPrice(product.price)
      setCategory(product.category)
      setStock(product.stock)
      setInStock(product.inStock)
      setFeaturedAt(product.featuredAt)
      setFeatures(product.features || [])
      setSizes(product.size || [])
      setExistingImages(product.images || [])
    }
  }, [product])

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
    const totalImages = existingImages.length + images.length + files.length

    if (totalImages > 4) {
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

  const handleRemoveExistingImage = (index: number) => {
    const updated = [...existingImages]
    updated.splice(index, 1)
    setExistingImages(updated)
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index))
  }

  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async () => {
    if (!name || !description || price === "" || !category || stock === "") {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalImages = existingImages.length + images.length;
    if (totalImages === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    const formData = new FormData();

    // Basic fields
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("stock", stock.toString());
    formData.append("inStock", inStock.toString());
    formData.append("featuredAt", featuredAt.toString());

    // Arrays
    sizes.forEach(size => formData.append("size", size));
    features.forEach(feature => formData.append("features", feature));

    // Existing images (important)
    existingImages.forEach(img => {
      formData.append("existingImages", JSON.stringify(img));
    });

    // New image files
    images.forEach(file => {
      formData.append("images", file);
    });

    try {
      const res = await API.put(`/admin/updateProduct/${product._id}`, formData);
      toast.success("Product updated successfully!");
      setShowEditForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
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
          <Label>Product Images * (Max 4 images total)</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="cursor-pointer"
          />
          <div className="text-sm text-muted-foreground">
            Current images: {existingImages.length + images.length}/4
          </div>
          
          {(existingImages.length > 0 || images.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Existing Images from DB */}
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative border rounded-lg aspect-square overflow-hidden group">
                  <img
                    src={img.url}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Current
                  </div>
                  <button
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Newly Selected Images */}
              {images.map((img, index) => (
                <div key={`new-${index}`} className="relative border rounded-lg aspect-square overflow-hidden group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </div>
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
            Update Product
          </Button>
          <Button
            onClick={() => setShowEditForm(false)}
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
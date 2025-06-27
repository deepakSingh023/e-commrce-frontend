"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import API from "@/lib/api"
import { X } from "lucide-react"

interface Props {
  fetchProducts: () => void
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>
}

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

  const handleSubmit = async () => {
    if (!name || !description || price === "" || stock === "") {
      toast.error("Please fill in all required fields")
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
    <div className="space-y-4">
      {/* Inputs */}
      <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full" />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full" />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} className="border p-2 w-full" />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="border p-2 w-full" />
      <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(Number(e.target.value))} className="border p-2 w-full" />

      {/* Sizes */}
      <div className="flex gap-2">
        <input value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="Size" className="border p-2 w-full" />
        <button onClick={handleAddSize} className="bg-green-600 text-white px-3 py-2 rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s, i) => (
          <span key={i} className="bg-gray-100 p-2 rounded flex items-center gap-2">{s}
            <X className="w-4 h-4 cursor-pointer" onClick={() => setSizes(sizes.filter((_, idx) => idx !== i))} />
          </span>
        ))}
      </div>

      {/* Features */}
      <div className="flex gap-2">
        <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} placeholder="Feature" className="border p-2 w-full" />
        <button onClick={handleAddFeature} className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {features.map((f, i) => (
          <span key={i} className="bg-gray-100 p-2 rounded flex items-center gap-2">{f}
            <X className="w-4 h-4 cursor-pointer" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} />
          </span>
        ))}
      </div>

      {/* Images */}
      <input type="file" accept="image/*" multiple onChange={handleImageSelect} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="relative border aspect-square overflow-hidden">
            <img src={URL.createObjectURL(img)} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
            <button onClick={() => handleRemoveImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Checkboxes */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2"><input type="checkbox" checked={inStock} onChange={() => setInStock(!inStock)} /> In Stock</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={featuredAt} onChange={() => setFeaturedAt(!featuredAt)} /> Featured</label>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Submit Product</button>
    </div>
  )
}

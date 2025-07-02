import React from 'react';
import { useState, useEffect } from 'react';
import API from '@/lib/api';
import { Product } from './Products';
import { toast } from "react-hot-toast"
import { X } from "lucide-react"

interface Props {
  
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>
  product: Product
}




export default function EditProduct({  setShowEditForm, product }: Props){

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



    

const handleSubmit = async () => {
  if (!name || !description || price === "" || stock === "") {
    toast.error("Please fill all required fields");
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
    const res = await API.put(`/admin/updateProduct/${product._id}`, formData
     
);

    toast.success("Product updated successfully!");
    setShowEditForm(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update product");
  }
};



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

      {/* Image Upload */}
<input type="file" accept="image/*" multiple onChange={handleImageSelect} />

<div className="grid grid-cols-2 md:grid-cols-4 gap-4">

  {/* Existing Images from DB */}
  {existingImages.map((img, i) => (
  <div key={`existing-${i}`} className="relative border aspect-square overflow-hidden">
    <img src={img.url} alt={`Existing ${i + 1}`} className="w-full h-full object-cover" />
    <button
      onClick={() => handleRemoveExistingImage(i)}
      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
))}


  {/* Newly Selected Images */}
  {images.map((img, i) => (
    <div key={`new-${i}`} className="relative border aspect-square overflow-hidden">
      <img src={URL.createObjectURL(img)} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
      <button
        onClick={() => handleRemoveImage(i)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
      >
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

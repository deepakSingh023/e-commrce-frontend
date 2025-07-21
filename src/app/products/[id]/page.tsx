"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import API from "@/lib/api"
import { Product } from "@/components/Tabs/Products"

export default function ProductDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviews, setReviews] = useState<{
  username: string;
  user: string;
  comment: string;
  createdAt: string;
  }[]>([]);

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)
  const [reviewMessage, setReviewMessage] = useState("")
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/getProductbyId/${params.id}`);
        console.log("Product ID param:", params.id);
        setProduct(response.data);
        setReviews(response.data.reviews || []);
        setUseFallback(false);
      } catch (error) {
        console.error("API failed, using sample data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch product details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
   };      
    
    
    const checkWishlist = async () => {  
      try {
        const response = await API.get(`/fav/check?productId=${params.id}`)
        setIsWishlisted(response.data.isWishlisted)
      } catch (error) {
        console.error("Error checking wishlist status:", error)
      }
    }

    fetchProduct()
    checkWishlist()
  }, [params.id, toast, useFallback])

  const addToCart = async () => {
    try {
      await API.post('/cart/addItemCart', {
        productId: product?._id,
        quantity
      })
      toast({
        title: "Added to cart!",
        description: `${quantity} ${product?.name} added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
    }
  }

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await API.delete(`/fav/removeFavorite`, { data: { productId: product?._id } })
      } else {
        await API.post('/fav/createFavorite', { productId: product?._id })
      }
      setIsWishlisted(!isWishlisted)
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted ? "Item removed from your wishlist" : "Item added to your wishlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      })
    }
  }

  const submitReview = async () => {
  if (!reviewMessage.trim()) return;

  try {
    const res = await API.post(`/products/addReview`, {
      comment:reviewMessage,
      productId: product?._id
    });

    toast({ title: "Review submitted successfully" });

    const newReview = res.data;
    setReviews((prev) => [...prev, newReview]);

    setReviewMessage("");
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Could not submit review",
      variant: "destructive",
    });
  }
};


  if (loading) {
    return (
      <div className="min-h-screen">
        
        <main className="container mx-auto px-4 py-16 text-center">
          <p>Loading product details...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
     
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[selectedImage]?.url
                    : "/ep1.jpg"
                }
                alt={product.name}
                className="w-full h-full object-cover"
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {Array.isArray(product.images) &&
                product.images.length > 0 &&
                product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? "border-black" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  ))}
              
              
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold">${product.price}</span>
              </div>

              <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={addToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleWishlist}
                  className={isWishlisted ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
          
          {/* Review Form */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Add Your Review</h3>
            <div className="flex flex-col space-y-4 max-w-2xl">
              <textarea
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
              />
              <Button 
                onClick={submitReview}
                className="self-start"
              >
                Submit Review
              </Button>
            </div>
          </div>
          
          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={`${review.username}-${review.createdAt}-${index}`} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">{review.username}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import API from "@/lib/api"
import { Product } from "@/components/Tabs/Products"

interface ProductWithFavorite extends Product {
  isFavorite: boolean;
}




export default function FeaturedProducts() {

  const [featuredProducts, setFeaturedProducts] = useState<ProductWithFavorite[]>([]);
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await API.get(`products/getFeaturedProducts`);
        setFeaturedProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchFeaturedProducts();
  },[])
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products with amazing deals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <Card key={product._id} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {product.category}
                  </Badge>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart
                        className={`h-4 w-4 transition-colors duration-300 ${
                          product.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        }`}
                      />
                    </Button>

                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews.length})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">${product.price}</span>
                  </div>

                  <Button className="w-full" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

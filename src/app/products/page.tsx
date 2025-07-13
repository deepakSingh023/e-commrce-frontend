"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Heart, ShoppingCart, Filter, Grid, List, ChartNoAxesColumnIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import  {Product} from "@/components/Tabs/Products"
import API from "@/lib/api"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/slices/cartSlice"
import { toast } from "react-hot-toast"
import { Console } from "console"

const categories = ["All", "Electronics", "Fashion", "Home", "Audio", "Accessories"]
const priceRanges = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200+", min: 200, max: Number.POSITIVE_INFINITY },
]

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favouriteProduct, setFavouriteProduct] = useState<string[]>([])
  const dispatch = useAppDispatch()


  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory, selectedPriceRanges, sortBy, currentPage])



  const fetchFavourites = async () => {
  try {
    const storedUser = String(localStorage.getItem("user"));
    const parsedUser = JSON.parse(storedUser);
    const token = parsedUser?.token;
    console.log("🔑 User token:", token);

    if(!token) {
      console.warn("No user token found, skipping favourites fetch");
      return;
    }

    const response = await API.get("/fav/getAllFavourite");
    

    console.log("💾 Raw favourites data:", response.data);

  
    const favProductIds = response.data.map((fav: any) =>
      typeof fav.product === "string" ? fav.product : fav.product._id
    );

    setFavouriteProduct(favProductIds); 
  } catch (error) {
    console.error("Failed to load favourites", error);
  }
};


useEffect(() => {
  fetchFavourites();
}, []);


const toggleFavourite = async (productId: string): Promise<void> => {
  try {
    const storedUser = String(localStorage.getItem("user"));
    const parsedUser = JSON.parse(storedUser);
    const token = parsedUser?.token;
    console.log("🔑 User token:", token);

    // Update local state regardless
    const alreadyInFav = favouriteProduct.includes(productId);

    setFavouriteProduct((prev) =>
      alreadyInFav ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    // Save guest favs to localStorage
    if (!token) {
      const guestFavs = alreadyInFav
        ? favouriteProduct.filter((id) => id !== productId)
        : [...favouriteProduct, productId];
      localStorage.setItem("guest.favourites", JSON.stringify(guestFavs));
      return;
    }

    // If logged in, sync with backend
    if (token&&alreadyInFav) {
      await API.delete("/fav/removeFavorite", {
        data: { productId },
      });
    } else {
      await API.post("/fav/createFavorite", { productId });
    }
  } catch (err) {
    console.error("Toggle favourite failed:", err);
    toast.error("Something went wrong while updating favourites.");
  }
};





  const fetchProducts = async (page = 1, limit = 9) => {
  try {
    const query: Record<string, any> = {
      page,
      limit,
    };

    if (searchQuery.trim()) query.search = searchQuery.trim();
    if (selectedCategory !== "All") query.category = selectedCategory;
    if (selectedPriceRanges.length > 0) query.priceRanges = selectedPriceRanges.join(",");
    if (sortBy !== "featured") query.sortBy = sortBy;

    const response = await API.get("/products/getProductsPage", { params: query });

    setProducts(response.data.products || []);
    setSortedProducts(response.data.products || []);
    setTotalPages(response.data.totalPages || 1); // backend should return total pages
    setCurrentPage(page);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};


const handleAddToCart = async (productId: string) => {
  try {
    await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    toast.success('Added to cart!');
  } catch (err) {
    toast.error('Failed to add item!');
  }
};


  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox
                id={range.label}
                checked={selectedPriceRanges.includes(range.label)}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  if (checked) {
                    setSelectedPriceRanges([...selectedPriceRanges, range.label])
                  } else {
                    setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range.label))
                  }
                }}
              />
              <label htmlFor={range.label} className="text-sm">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
     

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Products</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="py-6">
                    <h2 className="text-lg font-semibold mb-6">Filters</h2>
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardContent className="p-6">
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {sortedProducts.length} of {products.length} products
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <Link key={product._id} href={`/products/${product._id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.images[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.featuredAt && (
                            <Badge className="absolute top-3 left-3" variant="secondary">
                              featured
                            </Badge>
                          )}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                             size="icon"
                             variant="secondary"
                             className={`h-8 w-8 ${
                               favouriteProduct.includes(product._id)
                                 ? "text-red-500"
                                 : "text-gray-400"
                             }`}
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               toggleFavourite(product._id);
                             }}
                             >
                             <Heart
                               className="h-4 w-4"
                               fill={favouriteProduct.includes(product._id) ? "currentColor" : "none"}
                             />
                            </Button>

                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              
                            </div>
                            <span className="text-sm text-muted-foreground">
                              <Star className="flex "></Star>({product.reviews})</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold">${product.price}</span>
                          </div>

                          <Button
                            className="w-full"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleAddToCart(product._id)
                              // Handle add to cart
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <Link key={product._id} href={`/products/${product._id}`}>
                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="relative w-32 h-32 shrink-0">
                            <img
                              src={product.images[0]?.url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {product.featuredAt && (
                              <Badge className="absolute top-2 left-2" variant="secondary">
                                featured
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-xl">{product.name}</h3>
                               <Button
                             size="icon"
                             variant="secondary"
                             className={`h-8 w-8 ${
                               favouriteProduct.includes(product._id)
                                 ? "text-red-500"
                                 : "text-gray-400"
                             }`}
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               toggleFavourite(product._id);
                             }}
                             >
                             <Heart
                               className="h-4 w-4"
                               fill={favouriteProduct.includes(product._id.toString()) ? "currentColor" : "none"}
                             />
                            </Button>
                            </div>

                            

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold">${product.price}</span>
                                
                              </div>

                              <Button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleAddToCart(product._id)
                                }}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No products found matching your criteria</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedPriceRanges([])
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center mt-8 space-x-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
        
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>

      </main>

       <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Heart, ShoppingCart, Filter, Grid, List, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import  {Product} from "@/components/Tabs/Products"
import API from "@/lib/api"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/slices/cartSlice"
import { toast } from "react-hot-toast"


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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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
    localStorage.setItem("guest.favourites", JSON.stringify(favouriteProduct));

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

const handleFilterChange = () => {
  setIsFilterOpen(false) // Close mobile filter when filter changes
}

  const FilterSidebar = ({ isMobile = false }) => (
    <div className="space-y-6">
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
      )}
      
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className="w-full justify-start text-sm"
              onClick={() => {
                setSelectedCategory(category)
                if (isMobile) handleFilterChange()
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Price Range</h3>
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <div key={range.label} className="flex items-center space-x-3">
              <Checkbox
                id={range.label}
                checked={selectedPriceRanges.includes(range.label)}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  if (checked) {
                    setSelectedPriceRanges([...selectedPriceRanges, range.label])
                  } else {
                    setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range.label))
                  }
                  if (isMobile) handleFilterChange()
                }}
              />
              <label htmlFor={range.label} className="text-sm font-medium cursor-pointer">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {isMobile && (selectedCategory !== "All" || selectedPriceRanges.length > 0) && (
        <>
          <Separator />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedCategory("All")
              setSelectedPriceRanges([])
              handleFilterChange()
            }}
          >
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Products</h1>
          
          {/* Search and Controls */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="w-full">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              {/* Sort Dropdown */}
              <div className="flex-1 sm:max-w-xs">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode and Filter Button */}
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="hidden sm:flex border rounded-lg">
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

                {/* Mobile Filter Button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                      {(selectedCategory !== "All" || selectedPriceRanges.length > 0) && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                          {(selectedCategory !== "All" ? 1 : 0) + selectedPriceRanges.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <SheetHeader className="px-6 py-4 border-b">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="px-6 py-4 h-full overflow-y-auto">
                      <FilterSidebar isMobile={true} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 xl:w-72 shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <FilterSidebar />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {sortedProducts.length} of {products.length} products
              </div>
              
              {/* Mobile View Mode Toggle */}
              <div className="flex sm:hidden border rounded-lg w-fit">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory !== "All" || selectedPriceRanges.length > 0) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                      onClick={() => setSelectedCategory("All")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedPriceRanges.map((range) => (
                  <Badge key={range} variant="secondary" className="gap-1">
                    {range}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                      onClick={() => setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedPriceRanges([])
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Products Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {sortedProducts.map((product) => (
                  <Link key={product._id} href={`/products/${product._id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.images[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.featuredAt && (
                            <Badge className="absolute top-3 left-3" variant="secondary">
                              featured
                            </Badge>
                          )}
                          <div className="absolute top-3 right-3">
                            <Button
                             size="icon"
                             variant="secondary"
                             className={`h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity ${
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

                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 flex-1">{product.name}</h3>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({product.reviews.length} reviews)
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg sm:text-xl font-bold">${product.price}</span>
                          </div>

                          <Button
                            className="w-full"
                            size="sm"
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
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex gap-4 sm:gap-6">
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                            <img
                              src={product.images[0]?.url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {product.featuredAt && (
                              <Badge className="absolute top-1 left-1 text-xs" variant="secondary">
                                featured
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-semibold text-base sm:text-xl line-clamp-2">{product.name}</h3>
                               <Button
                             size="icon"
                             variant="secondary"
                             className={`h-8 w-8 shrink-0 ${
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

                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground">
                                ({product.reviews.length} reviews)
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <span className="text-xl sm:text-2xl font-bold">${product.price}</span>

                              <Button
                                className="w-full sm:w-auto"
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

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4 text-lg">No products found matching your criteria</div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedPriceRanges([])
                    setSearchQuery("")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                
                  <span className="text-sm text-muted-foreground px-2">
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
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
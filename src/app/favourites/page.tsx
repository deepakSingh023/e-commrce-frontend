"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import API from "@/lib/api";
import { Product } from "@/components/Tabs/Products";

interface Favourite {
  _id: string;
  user: string;
  product: Product;
  createdAt: string;
}

export default function FavouritesPage() {
  const [favItems, setFavItems] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUser, setHasUser] = useState(true); // assume true initially

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const storedUser = localStorage.getItem("user"); // or use token or session
        if (!storedUser) {
          setHasUser(false);
          setLoading(false);
          return;
        }

        const response = await API.get("/fav/getAllFavourite");
        setFavItems(response.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const removeItem = async (id: string) => {
    try {
      await API.delete(`/fav/removeFavorite`, { data: { productId: id } });
      setFavItems((prevItems) => prevItems.filter((item) => item.product._id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl px-4 mx-auto">
        <h1 className="text-4xl font-bold mb-4">Favourites</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !hasUser ? (
          <p className="text-gray-500">No user logged in. Please login to view favourites.</p>
        ) : favItems.length === 0 ? (
          <p className="text-gray-500">You have no favourite items.</p>
        ) : (
          <div className="lg:col-span-2 space-y-4 w-full">
            {favItems.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product.images[0]?.url || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product._id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${item.product.price}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

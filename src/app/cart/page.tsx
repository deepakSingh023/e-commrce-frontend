"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch,useAppSelector } from "@/store/hooks"
import {fetchCart,updateQuantity,removeFromCart} from "@/store/slices/cartSlice"


interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
}

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

 useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const response = await dispatch(fetchCart());

      console.log("FetchCart response:", response);

      if (fetchCart.fulfilled.match(response)) {
        if (!response.payload) {
          console.error("❌ No payload returned!");
          return;
        }

        const items: CartItem[] = response.payload.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0].url,
          quantity: item.quantity,
          size: item.size
        }));

        setCartItems(items);
      } else {
        toast({
          title: "Error fetching cart",
          description: response.error?.message ?? "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive",
      });
    }
  };

  fetchCartItems();
}, [dispatch, toast]);


 const updateQuantities = (id: string, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeItem(id); // delegate to remove logic
    return;
  }

  // Dispatch Redux thunk to update on backend and store
  dispatch(updateQuantity({ productId: id, quantity: newQuantity }))
    .unwrap()
    .then(() => {
      console.log("Updated quantity for", id, "to", newQuantity);
      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    })
    .catch(() => {
      toast({
        title: "Failed to update quantity",
        variant: "destructive",
      });
    });
};


  const removeItem = (id: string) => {
  // Dispatch Redux thunk to remove from backend and store
  dispatch(removeFromCart({ productId: id}))
    .unwrap()
    .then(() => {
      setCartItems((items) => items.filter((item) => item.id !== id));
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    })
    .catch(() => {
      toast({
        title: "Failed to remove item",
        variant: "destructive",
      });
    });
};


  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo("SAVE10")
      toast({
        title: "Promo code applied!",
        description: "You saved 10% on your order",
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again",
        variant: "destructive",
      })
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                       src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold">${item.price}</span>
                          
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantities(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantities(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (SAVE10)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Promo Code</h3>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {appliedPromo} Applied
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAppliedPromo(null)
                        setPromoCode("")
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Try "SAVE10" for 10% off your order</p>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

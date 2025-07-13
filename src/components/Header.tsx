"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, User, Menu, Heart, Package, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logout } from "@/store/slices/authSlice"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.auth)
  const isLoggedIn = !!user
  const username = user?.username || ""

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.token && parsedUser.username) {
          // The auth slice will handle this through the persisted state
          // No need to dispatch login here as it's already handled by Redux
        }
      } catch (err) {
        console.error("Failed to parse user data", err)
      }
    }
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ECommerce
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-2 mr-4">
              <Link href="/favourites">
              <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button> 
              </Link>
              
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex justify-center items-center">3</Badge>
                </Button>
              </Link>
              <Link href="/orders"><Button variant="ghost" size="icon"><Package className="h-5 w-5" /></Button></Link>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-2 border-l pl-4">
              {!isLoggedIn ? (
                <>
                  <Link href="/login"><Button variant="ghost"><LogIn className="h-4 w-4" />Login</Button></Link>
                  <Link href="/register"><Button variant="outline"><User className="h-4 w-4" />Register</Button></Link>
                  <Link href="/admin/login"><Button variant="ghost">Admin</Button></Link>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium px-2">Hi, {username}</span>
                  <Link href="/admin/login"><Button variant="ghost">Admin</Button></Link>
                  <Button variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4" />Sign Out</Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} className="text-lg font-medium py-2">
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <Link href="/orders" className="py-2">My Orders</Link>
                    {!isLoggedIn ? (
                      <>
                        <Link href="/admin/login" className="py-2">Admin Login</Link>
                        <Link href="/login" className="py-2">Login</Link>
                        <Link href="/register" className="py-2">Register</Link>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">Hi, {username}</span>
                        <Link href="/admin/login" className="py-2">Admin</Link>
                        <button onClick={handleLogout} className="text-red-600 py-2">Sign Out</button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
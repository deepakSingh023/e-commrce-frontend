"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, User, Menu, Heart, Package, LogIn, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {logoutUser} from '@/lib/logoutUser'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { user } = useAppSelector((state) => state.auth)
  const isLoggedIn = !!user
  const username = user?.username || ""

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData && !user) {
      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.token && parsedUser.username) {
          // You'll need to dispatch your existing login action here
          // For example: dispatch(setUser(parsedUser)) or similar
          // Replace this comment with your actual login action
          console.log("User data found in localStorage:", parsedUser)
        }
      } catch (err) {
        console.error("Failed to parse user data", err)
        localStorage.removeItem("user") // Clean up invalid data
      }
    }
  }, [dispatch, user])

  const handleLogout = () => {
    dispatch(logoutUser())
    localStorage.removeItem("user") // Clear localStorage
    setIsSheetOpen(false) // Close mobile menu
    router.push("/")
  }

  const handleLinkClick = () => {
    setIsSheetOpen(false) // Close mobile menu when navigating
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
  ]

  const userActions = [
    { name: "Favourites", href: "/favourites", icon: Heart },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "My Orders", href: "/orders", icon: Package },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ECommerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary relative ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Action Icons */}
            <div className="flex items-center space-x-1 mr-4">
              {userActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                    <action.icon className="h-5 w-5" />
                  </Button>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-2 border-l border-border pl-4">
              {!isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Register
                    </Button>
                  </Link>
                  <Link href="/admin/login">
                    <Button variant="ghost" size="sm">Admin</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Hi, </span>
                    <span className="font-medium text-foreground">{username}</span>
                  </div>
                  <Link href="/admin/login">
                    <Button variant="ghost" size="sm">Admin</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
                </div>
              </SheetHeader>
              
              <div className="flex flex-col h-full">
                {/* User Section */}
                {isLoggedIn && (
                  <div className="px-6 py-4 bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Hi, {username}</p>
                        <p className="text-sm text-muted-foreground">Welcome back!</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="flex-1 px-6 py-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Navigation</h3>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* User Actions */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
                    {userActions.map((action) => (
                      <Link
                        key={action.name}
                        href={action.href}
                        onClick={handleLinkClick}
                        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors text-foreground hover:bg-muted"
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon className="h-4 w-4" />
                          <span>{action.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Auth Section */}
                <div className="px-6 py-4 border-t bg-muted/30">
                  {!isLoggedIn ? (
                    <div className="space-y-2">
                      <Link href="/login" onClick={handleLinkClick}>
                        <Button className="w-full gap-2" size="sm">
                          <LogIn className="h-4 w-4" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={handleLinkClick}>
                        <Button variant="outline" className="w-full gap-2" size="sm">
                          <User className="h-4 w-4" />
                          Register
                        </Button>
                      </Link>
                      <Link href="/admin/login" onClick={handleLinkClick}>
                        <Button variant="ghost" className="w-full" size="sm">
                          Admin Login
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/admin/login" onClick={handleLinkClick}>
                        <Button variant="ghost" className="w-full" size="sm">
                          Admin Panel
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/30" 
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
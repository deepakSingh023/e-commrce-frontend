<<<<<<< HEAD
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Headers() {
  return (
    <header className="w-full h-20 bg-neutral-50 flex justify-between items-center gap-2 p-4 shadow-lg">
      <div className="flex justify-between item-center gap-3 mr-20 ">
        <Image
        src="https://images.hindustantimes.com/img/2023/01/14/1600x900/Sidharth-Malhotra_1673698467367_1673698467564_1673698467564.jpg"
        alt="Sidharth Malhotra"
        width={50}
        height={50}
        className="bg-blue-500 rounded-full"
        />
        <h1 className="text-3xl font-bold">E‑COMMERCE WEB</h1>
      </div>
      <div>
        <nav className="space-x-4 flex justify-between items-center gap-6 text-xl">
            <Link href="/"><button>Home</button></Link>
            <Link href="/about"><button>About</button></Link>
            <Link href="/products"><button>Products</button></Link>
            <Link href="/Contact"><button>Contact</button></Link>
        </nav>
      </div>
       
      <div className="flex justify-between items-center gap-5 ml-20">
      <nav className="flex justify-between items-center gap-5">
            <Link href="/cart"><button>Cart</button></Link>
            <Link href="/myOrder" className="border rounded-md p-2"><button>MyOrder</button></Link>
            <Link href="/adminLogin"  className="border rounded-md p-2 bg-red-300"><button>Admin</button></Link>
      </nav>
      <h3>username</h3>
      <button  className="border rounded-md p-2">logout</button>

      </div>
      
      
    </header>
  );
=======
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Search, Menu, Heart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ECommerece
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 bg-muted/50" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/login" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Admin Login
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>

                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <Link href="/orders" className="flex items-center py-2" onClick={() => setIsOpen(false)}>
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                    <Link href="/admin/login" className="flex items-center py-2" onClick={() => setIsOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Admin Login
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
>>>>>>> 3cab3d6 (ui done)
}

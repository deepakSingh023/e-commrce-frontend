"use client";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function FavouritesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      
    } catch (error) {}
  })
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl px-4 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Favourites</h1>
        <p className="text-gray-500">Your favourite products will appear here.</p>
      </div>

      <Footer />
    </div>
  );
}

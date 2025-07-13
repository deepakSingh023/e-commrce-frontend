"use client";
import Footer from "@/components/Footer";

export default function FavouritesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <div>
            <h1 className="text-2xl font-bold mb-4">Favourites</h1>
            <p className="text-gray-500">Your favourite products will appear here.</p>



        </div>
      
      <Footer/>
    </div>
  );
}
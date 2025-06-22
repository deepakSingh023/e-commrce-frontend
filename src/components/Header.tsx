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
}

"use client"
import Link from "next/link"


export default function AdminHeader() {
    return (
        <div>
            <header className=" p-4 flex items-center justify-between bg-white shadow border">
          
                <h1 className="text-2xl font-bold pl-6">Dashboard</h1>

                <div className="flex gap-4">
                <button className="p-3 border rounded-md" >Refresh</button>
                <button className="p-3 border rounded-md">view website</button>
                <button className="p-3 border rounded-md">LogOut</button>
            </div>
            
            </header>
            
            
            

        </div>
      
    )
}
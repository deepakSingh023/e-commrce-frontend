"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";


export default function AdminHeader() {
  const dispatch = useAppDispatch();
  
  // Reload the page
 

  return (
    <div>
      <header className="p-4 flex items-center justify-between bg-white shadow border">
        <h1 className="text-2xl font-bold pl-6">Dashboard</h1>

        <div className="flex gap-4">
          <button className="p-3 border rounded-md" >
            Refresh
          </button>
          <button className="p-3 border rounded-md" >
            View Website
          </button>
          <button className="p-3 border rounded-md" >
            Log Out
          </button>
        </div>
      </header>
    </div>
  );
}

"use client"
import Products from "./Products"
import Orders from "./Orders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnalyticsDashboard from "../admin/AnalyticsDashboard"


export default function TabBar() {
    return (
        <Tabs defaultValue="dashboard" className=" mt-4 ml-4 mr-4">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="orders"><Orders/></TabsContent>
            <TabsContent value="products"><Products/></TabsContent>
            <TabsContent value="content">Account Content</TabsContent>
            <TabsContent value="analytics"><AnalyticsDashboard/></TabsContent>
        </Tabs>
    )
}
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function TabBar() {
    return (
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">Account Content</TabsContent>
            <TabsContent value="products">Account Content</TabsContent>
            <TabsContent value="messages">Account Content</TabsContent>
            <TabsContent value="content">Account Content</TabsContent>
            <TabsContent value="analytics">Password Content</TabsContent>
        </Tabs>
    )
}
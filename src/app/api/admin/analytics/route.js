// import {
//   getSalesData,
//   getOrderAnalytics,
//   getProductAnalytics,
//   getCustomerAnalytics
// } from "@/lib/analytics";

// export async function GET() {
//   try {
//     const [sales, orders, products, customers] = await Promise.all([
//       getSalesData(),
//       getOrderAnalytics(),
//       getProductAnalytics(),
//       getCustomerAnalytics()
//     ]);

//     return new Response(
//       JSON.stringify({ sales, orders, products, customers }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" }
//       }
//     );
//   } catch (error) {
//     console.error("Analytics API error:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal server error" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" }
//       }
//     );
//   }
// }

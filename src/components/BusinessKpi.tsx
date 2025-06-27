import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function BusinessKpi() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 px-4 mt-6">
      <Card className="w-full h-[120px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">12</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </CardFooter>
      </Card>

      <Card className="w-full h-[120px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">1,234</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </CardFooter>
      </Card>

      <Card className="w-full h-[120px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">1,234</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </CardFooter>
      </Card>

      <Card className="w-full h-[120px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">1,234</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </CardFooter>
      </Card>

      <Card className="w-full h-[120px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">1,234</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </CardFooter>
      </Card>
    </div>
  );
}

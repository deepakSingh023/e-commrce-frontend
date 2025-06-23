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
    <div className="grid gap-4 mt-6 md:grid-cols-5"> 
        <Card className="ml-4">
            <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active this month</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">1,234</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active this month</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">1,234</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active this month</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">1,234</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active this month</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">1,234</p>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardFooter>
        </Card>
        <Card className="mr-4">
            <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active this month</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">1,234</p>
            </CardContent>
            <CardFooter>
                 <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardFooter>
        </Card>
    </div>
  )
}
 



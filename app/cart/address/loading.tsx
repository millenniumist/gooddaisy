import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Name & Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </CardContent>
      </Card>
    </div>
  )
}

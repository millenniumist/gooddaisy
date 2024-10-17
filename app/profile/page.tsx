import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import * as jose from 'jose'
import { cookies } from 'next/headers'
import prisma from '@/config/prisma'
import Link from 'next/link'

async function getUser(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      }
    }
  })
}

async function updateAddress(formData: FormData) {
  'use server'
  const token = cookies().get('token')?.value || ''
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const { payload } = await jose.jwtVerify(token, secret)
  const id = payload.userId as number

  const address = formData.get('address') as string

  await prisma.user.update({
    where: { id },
    data: { address }
  })

  revalidatePath('/profile')
  redirect('/profile')
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const token = cookies().get('token')?.value || ''
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const { payload } = await jose.jwtVerify(token, secret)
  const id = payload.userId as number

  const user = await getUser(id)
  const isEditing = searchParams.edit === 'true'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          {user?.pictureUrl && (
            <img src={user.pictureUrl} alt={user.displayName} className="w-16 h-16 rounded-full mr-4" />
          )}
          <div>
            <h2 className="text-xl font-semibold">{user?.displayName}</h2>
            <p className="text-sm text-gray-600">{user?.statusMessage}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form action={updateAddress}>
              <Textarea
                name="address"
                className="mb-4"
                placeholder="Enter your address"
                defaultValue={user?.address || ''}
                required
              />
              <div className="flex space-x-2">
                <Button type="submit">Save Address</Button>
                <Button variant="outline" formAction="/profile">Cancel</Button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-4">{user?.address || 'No address provided'}</p>
              <form action="/profile">
                <input type="hidden" name="edit" value="true" />
                <Button type="submit">Edit Address</Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {user?.orders && user.orders.length > 0 ? (
            user.orders.map((order) => (
              <div key={order.id} className="mb-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Order #{order.id}</h3>
                <p className="text-sm text-gray-600 mb-2">Date: {new Date(order.createdDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 mb-4">Payment Status: {order.paymentStatus}</p>
                <h4 className="font-medium mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="text-sm">
                        {item.colorRefinement && " (Color Refinement)"}
                        {item.message && ` (Message: ${item.message})`}
                        {item.addOnItem && " (Add-on Item)"}
                        ฿{item.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right">
                  <p className="font-semibold">Total: ฿{order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

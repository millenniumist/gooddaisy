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
    select: { address: true, displayName: true, pictureUrl: true }
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

  revalidatePath('/cart/address')
  redirect('/cart/address')
}

export default async function AddressPage({
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Name & Address</CardTitle>
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
                <Button variant="outline" formAction="/cart/address">Cancel</Button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-4">{user?.address || 'No address provided'}</p>
              <form action="/cart/address">
                <input type="hidden" name="edit" value="true" />
                <div className="flex justify-between">
                  <Button type="submit" className="w-24">Edit Address</Button>
                  <Link href="/checkout">
                    <Button type="button" className="w-24">Checkout</Button>
                  </Link>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
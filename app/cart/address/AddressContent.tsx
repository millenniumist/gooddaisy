'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from 'next/link'

export default function AddressContent({ user, isEditing, updateAddress }: { user: any, isEditing: boolean, updateAddress: (formData: FormData) => Promise<void> }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleEdit = () => {
    router.push('/cart/address?edit=true')
  }

  const handleCancel = () => {
    router.push('/cart/address')
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    const formData = new FormData(event.currentTarget)
    try {
      await updateAddress(formData)
      router.push('/cart/address')
    } catch (error) {
      console.error('Error updating address:', error)
      // Optionally, display an error message to the user
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
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
            <form onSubmit={handleSubmit}>
              <Textarea
                name="address"
                className="mb-4"
                placeholder="Enter your address"
                defaultValue={user?.address || ''}
                required
              />
              <div className="flex space-x-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Address'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-4">{user?.address || 'No address provided'}</p>
              <div className="flex justify-between">
                <Button onClick={handleEdit} className="w-24" disabled={isPending}>
                  {isPending ? 'Loading...' : 'Edit Address'}
                </Button>
                <Button onClick={handleCheckout} className="w-24" disabled={isPending}>
                  {isPending ? 'Loading...' : 'Checkout'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

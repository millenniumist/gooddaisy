import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as jose from 'jose'
import { cookies } from 'next/headers'
import prisma from '@/config/prisma'
import { Suspense } from 'react'
import AddressContent from './AddressContent'
import Loading from './loading'

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

  const isEditing = searchParams.edit === 'true'
  const user = await getUser(id)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <Suspense fallback={<Loading />}>
        <AddressContent user={user} isEditing={isEditing} updateAddress={updateAddress} />
      </Suspense>
    </div>
  )
}

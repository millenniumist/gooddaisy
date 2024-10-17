"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useMainStorage } from "@/store/mainStorage"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const [total, setTotal] = useState(0)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const { setCheckOutAlready } = useMainStorage()

  useEffect(() => {
    getTotalPrice()
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTotalPrice = async () => {
    const totalPrice = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/checkout/`)
    setTotal(+totalPrice.data?.totalPrice)
  }

  const confirmPayment = async () => {
    try {
      if (!uploadedImage) {
        alert("Please upload a payment slip before confirming.")
        return
      }

      // Upload image to Cloudinary
      const formData = new FormData()
      formData.append('file', uploadedImage)
      formData.append('upload_preset', 'ml_default')
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string)

      const cloudinaryResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
        formData
      )

      // Proceed with payment confirmation
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/checkout/`, {
        paymentProofUrl: cloudinaryResponse.data.secure_url
      })

      setCheckOutAlready(false)
      setTotal(0)
      localStorage.setItem("mainStorage", JSON.stringify([]))
      alert("Payment successful")
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error(error)
      alert("Payment failed. Please try again.")
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/upload-slip`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setUploadedImage(response.data.url)
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image')
      }
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <Card className="w-full max-w-3xl flex flex-col items-center">
      <CardHeader className="text-center">
        <CardTitle>Scan to Pay</CardTitle>
        <p className="text-sm text-muted-foreground">Time left to pay: {formatTime(timeLeft)}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {uploadedImage ? (
          <Image src={uploadedImage} alt="Uploaded payment proof" width={300} height={300} />
        ) : (
          <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/mockup-qr-code" alt="QR Code" width={300} height={300} />
        )}
        <p className="text-2xl font-bold mt-4">Total: ${total.toFixed(2)}</p>
        <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-4" />
        <Button onClick={confirmPayment} className="mt-4">Confirm Payment</Button>
      </CardContent>
    </Card>
  )
}

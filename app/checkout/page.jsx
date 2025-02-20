"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react"
import { useMainStorage } from "@/store/mainStorage"

export default function CheckoutPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(900)
  const [total, setTotal] = useState(0)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const { setCheckOutAlready } = useMainStorage()

  useEffect(() => {
    getTotalPrice()
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTotalPrice = async () => {
    const totalPrice = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/checkout`)
    setTotal(+totalPrice.data?.totalPrice)
  }

  const confirmPayment = async () => {
    try {
      if (!uploadedImage) {
        alert("Please upload a payment slip before confirming.")
        return
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/checkout/`, {})

      setCheckOutAlready(false)
      setTotal(0)
      localStorage.setItem("mainStorage", JSON.stringify([]))
      alert("Payment successful")
      router.push('/')
    } catch (error) {
      console.error(error)
      alert("Payment failed. Please try again.")
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/upload-slip`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          // Add timeout and error handling
          timeout: 30000,
          validateStatus: (status) => status < 500
        });
        setUploadedImage(response.data.url);
      } catch (error) {
        console.error('Detailed upload error:', error.response?.data || error.message);
        alert('Failed to upload image: ' + (error.response?.data?.error || 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    }
  };
  

  const formatTime = (seconds) => {
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
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-32 w-32 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">กำลังอัพโหลดสลิป...</p>
          </div>
        ) : uploadedImage ? (
          <Image src={uploadedImage} alt="Uploaded payment proof" width={300} height={300} />
        ) : (
          <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/mockup-qr-code" alt="QR Code" width={300} height={300} />
        )}
        <p className="text-2xl font-bold mt-4">ยอดรวม: ฿{total.toFixed(2)}</p>
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="mt-4 cursor-pointer"
          disabled={isUploading}
        />
        <p className="mt-4 text-center text-l text-muted-foreground whitespace-pre-line">
          ขอบคุณสำหรับออเดอร์ค่ะ
          
          กดส่งข้อมูลเรียบร้อยแล้ว รบกวนแจ้งทางแชทอีกครั้งและรอทางร้านแจ้งยอดมัดจำ หลังชำระแล้วทางร้านจะแจ้งเลขออเดอร์ และวิธี+ที่อยู่การจัดส่งให้ค่ะ^^
        </p>
        <Button 
          onClick={confirmPayment} 
          className="mt-4"
          disabled={isUploading || !uploadedImage}
        >
          ยืนยันการชำระเงิน
        </Button>
      </CardContent>
    </Card>
  )
}

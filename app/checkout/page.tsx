"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useMainStorage } from "@/store/mainStorage"

export default function CartPage() {
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const [total, setTotal] = useState(0)
  const {setCheckOutAlready} = useMainStorage()
  useEffect(() => {
    // Simulating total fetch, replace with actual data fetching logic
    getTotalPrice()
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getTotalPrice = async()=> {
    const totalPrice = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/checkout/`)
    console.log(totalPrice.data?.totalPrice)
    setTotal(+totalPrice.data?.totalPrice)
  }
  const confirmPayment = async()=> {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/checkout/`)
      console.log(res.data)
      setCheckOutAlready(false)
      setTotal(0)
      alert("Payment successful")
      // Remove all items from cartItems
      localStorage.setItem("mainStorage", JSON.stringify([]))
    } catch (error) {
      console.log(error)
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
        <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/mockup-qr-code
" alt="QR Code" width={300} height={300} />
        <p className="text-2xl font-bold mt-4">Total: ${total.toFixed(2)}</p>
      </CardContent>
      <Button onClick={confirmPayment}>Confirm Payment</Button>
    </Card>
  )
}

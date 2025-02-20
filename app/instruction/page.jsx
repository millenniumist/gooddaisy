'use client'
import { useMainStorage } from '@/store/mainStorage';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function InstructionPage() {
  const router = useRouter()
  const [monthlyOrders, setMonthlyOrders] = useState(0)
  const ORDER_LIMIT = process.env.NEXT_PUBLIC_MONTHLY_ORDER_LIMIT || 20
  const { setCheckOutAlready, user, isLoggedIn } = useMainStorage()

  // Add handleCheckout function
  const handleCheckout = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    await axios.post(`${process.env.NEXT_PUBLIC_URL}api/cart/`, {
      userId: user.id,
    });
    setCheckOutAlready(true);
    router.push('/checkout');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setMonthlyOrders(data.ordersInCurrentMonth)
    }
    fetchOrders()
  }, [])

  if (monthlyOrders >= ORDER_LIMIT) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>เดือนนี้มีผู้สนใจเยอะมากค่ะ / High Demand This Month!</CardTitle>
            <CardDescription>
              ยินดีต้อนรับเดือนถัดไปค่ะ กรุณาติดตามอัพเดทรอบใหม่ได้ที่ Instagram ของเราค่ะ
              <br />
              We look forward to serving you next month. Follow us on Instagram for new slot updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a 
              href="https://www.instagram.com/gooddaisy.store/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block text-center"
            >
              @gooddaisy.store
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Instruction!! ขั้นตอนการสั่งซื้อ กรุณาอ่านให้จบ!!</CardTitle>
          <CardDescription>Our 6 step process for Flower preservation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">1. Booking</h3>
            <p className="text-sm text-muted-foreground">
              ลูกค้าจองคิวเลือกรูปทรง และชำระมัดจำ50%<br/>
              Booking (ต้องจองคิวและชำระมัดจำก่อนเท่านั้น จึงจะส่งดอกไม้มาได้)<br/>
              รับเพียง{ORDER_LIMIT}ออเดอร์ต่อเดือนเท่านั้น
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Shipping</h3>
            <p className="text-sm text-muted-foreground">
              ลูกค้าจัดส่งดอกไม้<br/>
              (ควรส่งถึงภายใน4วัน หลังได้รับดอกไม้)<br/>
              *พร้อมแนบเลขออเดอร์ที่ได้รับหลังชำระเงินและชื่อไลน์มากับช่อดอกไม้ก่อนจัดส่ง <br/>
              **ดูรายละเอียดการจัดส่งเพิ่มเติมได้ที่เมนู <span className="font-bold">Flower Shipping</span> ใน Line Rich Menu
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Drying</h3>
            <p className="text-sm text-muted-foreground">
              ทางร้านทำการอบแห้งหลังได้รับดอกไม้ภายในวัน<br/>
              (ทางร้านไม่มีนโยบายคืนดอกไม้ที่เหลือรวมถึงกระดาษช่อดอกไม้)
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">4. Design</h3>
            <p className="text-sm text-muted-foreground">
              ทางร้านส่งแพทเทิร์นการจัดเรียงดอกไม้ให้ลูกค้าก่อนเริ่มสตัฟฟ์ และแจ้งชำระยอดคงเหลือ<br/>
              (ประมาณ 1 เดือนหลังจากได้รับดอกไม้)
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">5. Finish Preservation</h3>
            <p className="text-sm text-muted-foreground">
              ทางร้านทำการลงเรซิ่นอีกประมาณ 2 เดือน+-<br/>
              ทางร้านส่งรูปแจ้งชิ้นงานเสร็จและจัดส่งทางไปรษณีย์<br/>
              (รวมระยะเวลารอชิ้นงานประมาณ3เดือน+-)
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleCheckout}
          >
            Accept & Continue to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

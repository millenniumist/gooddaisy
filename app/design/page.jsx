"use client";
import React, { useState } from "react";
import { useMainStorage } from "@/store/mainStorage";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

function DesignPage() {
  const [note, setNote] = useState("");
  const { user } = useMainStorage();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/product/design`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          message: note,
        }),
      });

      if (response.ok) {
        router.push("/cart");
      }
    } catch (error) {
      console.error("Error updating design note:", error);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pattern Design การจัดเรียงดอกไม้</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-gray-700">
                  ลูกค้าสามารถระบุการจัดเรียงดอกไม้
                  เพื่อทางร้านจะสามารถจัดเรียงตรงตามความต้องการของลูกค้าได้มากที่สุด
                  เพราะหากมีการแก้ไขแบบ จะทำให้ออเดอร์ล่าช้าได้
                </p>
                <p className="text-gray-600 italic">
                  ตย.เช่น จัดทรงช่อ, ระบุสีดอกไม้, ระบุดอกไม้, จัดวางแบบกระจาย,
                  จัดวางแบบแน่นชิ้นงาน, จัดวางเน้นตรงกลาง เป็นต้น
                </p>
                <p className="text-gray-600">หรือส่งรูปตัวอย่างมาทางแชทไลน์ได้ค่ะ</p>
              </div>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="กรุณาระบุรายละเอียดการจัดเรียงดอกไม้ (ไม่บังคับ)"
              className="min-h-[128px] resize-none focus:ring-yellow-200"
            />

            <p className="text-gray-500 text-sm">
              (หากไม่มีข้ามได้ค่ะ ทางร้านจะจัดเรียงให้ตามที่เห็นว่าสวยและเหมาะสมค่ะ^^)
            </p>

       

              <Button
                type="button"
                className="w-full text-white font-bold"
                onClick={() => router.push("/instruction")}
              >
                Next
              </Button>
       
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default DesignPage;

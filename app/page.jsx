import prisma from "@/config/prisma";
import jwt from "jsonwebtoken";
import MainProductList from "./page-components/map-components/MainProductList";
import SubProductList from "./page-components/map-components/SubProductList";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductShowcase() {
  const productList = await prisma.product.findMany({
    include: { images: true },
  });

  return (
    <div className="container mx-auto py-16 px-4">
      <section>
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800">
          Select Your Shape
        </h1>
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          เลือกรูปทรง
        </h2>
        
        {/* Notice Box */}
        <div className="bg-amber-50 p-6 rounded-lg shadow-sm mb-12 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-3">หมายเหตุ:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>รูปทรงที่เคยลงรูปในไอจี แต่ไม่มีให้เลือก=งดทำ</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>การสตัฟฟ์พวงมาลัยสมรสรับทำเฉพาะขนาดผืนผ้า 9x12 หรือ 12x9 เท่านั้น</span>
            </li>
          </ul>
        </div>

        <MainProductList productList={productList} />
      </section>
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Enhance Your Experience
        </h2>
        <SubProductList productList={productList} />
      </section>
    </div>
  );
}

import prisma from "@/config/prisma";
import jwt from "jsonwebtoken";
import MainProductList from "./page-components/map-components/MainProductList";
import SubProductList from "./page-components/map-components/SubProductList";
// Force dynamic rendering to ensure fresh cookie data
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function ProductShowcase() {
  
  const productList = await prisma.product.findMany({
    include: { images: true },
  });

  return (
    <div className="container mx-auto py-16 px-4 ">
      <section>
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Select Your Flower Preservation Mold
        </h1>
        {/* <MainProductList productList={productList}  /> */}
      </section>
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Enhance Your Experience
        </h2>
        {/* <SubProductList productList={productList}  /> */}
      </section>
    </div>
  );
}

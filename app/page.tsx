export const revalidate = 0;
import MainProductList from "./page-components/map-components/MainProductList";
import SubProductList from "./page-components/map-components/SubProductList";
import prisma from "@/config/prisma";
import { Product } from "@prisma/client";

interface ProductShowcaseProps {
  productList: (Product & { images: any[] })[]; // Ensure images are included in the type
}

export default async function ProductShowcase() {
  const productList: ProductShowcaseProps['productList'] = await prisma.product.findMany({
    include: {
      images: true,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Flower Preservation Mold</h1>
      <MainProductList productList={productList} />
      <h1 className="text-3xl font-bold m-6 text-center">Buy one main product first</h1>
      <SubProductList productList={productList} />
    </div>
  );
}

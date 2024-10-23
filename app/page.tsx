export const revalidate = 0;
import MainProductList from "./page-components/map-components/MainProductList";
import SubProductList from "./page-components/map-components/SubProductList";
import prisma from "@/config/prisma";
import { cookies } from "next/headers";
import { Decimal } from "@prisma/client/runtime/library";
import { ProductList } from "./types";

function convertDecimalToNumber<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value instanceof Decimal ? Number(value) : value,
    ])
  ) as T;
}

export default async function ProductShowcase() {
  
  const productList = await prisma.product.findMany({
      include: {
        images: true,
      },
    });
  

  
  const convertedProductList: ProductList = productList.map((product) =>
    convertDecimalToNumber({
      ...product,
      images: product.images.map((image) => ({
        ...image,
        productId: Number(image.productId),
      })),
    })
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Flower Preservation Mold</h1>
      <MainProductList productList={convertedProductList} />
      <h1 className="text-3xl font-bold m-6 text-center">Buy one main product first</h1>
      <SubProductList productList={convertedProductList} />
    </div>
  );
}

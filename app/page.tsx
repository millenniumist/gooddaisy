import { CardFooter } from "@/components/ui/card";
import Product from "./page-components/Product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from '@/config/prisma';
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers"; 
import { redirect } from "next/navigation";
import AuthWrapper from "@/utils/AuthWrapper";
//ngrok http --domain=choice-arriving-drake.ngrok-free.app 3000
async function ProductList() {
  const cookiesStore = cookies();
  const token = cookiesStore.get('token');
  const user = token ? verifyToken(token.value) : null;
  !user && redirect('/login');
  const productList = await prisma.product.findMany({
    include: {
      images: true,
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md ">
          <Product
            id={product.id}
            name={product.name}
            price={product.price}
            images={product.images.map((image, index) => ({
              key: index,
              url: image.url,
            }))}
          />
          <CardFooter className="flex justify-between items-center pt-4">
            <span className="text-lg font-semibold">฿{product.price.toString()}</span>
            <Button className="min-w-[100px]">
              <Link href={`/product/${product.id}`}>Select</Link>
            </Button>
          </CardFooter>
        </div>
      ))}
    </div>
  );
}

export default async function ProductShowcase() {
  return (
    <AuthWrapper>
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Flower Preservation Mold</h1>
      <ProductList />
    </div>
    </AuthWrapper>
  );
}

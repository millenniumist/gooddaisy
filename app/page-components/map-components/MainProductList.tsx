import { CardFooter } from "@/components/ui/card";
import Product from "../Product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductList } from "@/app/types";

export default async function MainProductList({productList }: {productList: ProductList}) {
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productList.filter((product) => !product.subProduct).map((product) => (
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
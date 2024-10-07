import { CardFooter } from "@/components/ui/card";
import Product from "./page-components/Product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

export default async function ProductShowcase() {
  const productList = await axios.get("http://localhost:3000/api/").then((res) => res.data);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Flower Preservation Mold</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <pre>{JSON.stringify(productList, null, 2)}</pre> */}
        {productList.map((product: any) => (
          <>
            <div>
              <Product
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                images={product.images.map((image: any, index: number) => ({
                  key: index,
                  url: image.url,
                }))}
              />
              <CardFooter className="flex justify-between items-center">
                <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                <Button>
                  <Link href={`/product/${product.id}`}>Select</Link>
                </Button>
              </CardFooter>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

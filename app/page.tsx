import { CardFooter } from "@/components/ui/card";
import Product from "./page-components/Product";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const products = [
  {
    id: 1,
    name: "Heart Shape Mold",
    price: 29.99,
    images: ["/images/heart-mold-1.jpg", "/images/heart-mold-2.jpg", "/images/heart-mold-3.jpg"],
  },
  {
    id: 2,
    name: "Round Shape Mold",
    price: 24.99,
    images: ["/images/round-mold-1.jpg", "/images/round-mold-2.jpg", "/images/round-mold-3.jpg"],
  },
  {
    id: 3,
    name: "Square Shape Mold",
    price: 27.99,
    images: ["/images/square-mold-1.jpg", "/images/square-mold-2.jpg", "/images/square-mold-3.jpg"],
  },
];

export default function ProductShowcase() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Flower Preservation Mold</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <>
            <Product
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              images={product.images}
            />
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
              <Button ><Link href={`/product/${product.id}`}>Select</Link></Button>
            </CardFooter>
          </>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductList } from "@/app/types";
import Product from "../Product";
import { useMainStorage } from '@/store/mainStorage';
import axios from 'axios';

interface SubProductListProps {
  productList: ProductList;
}

export default function SubProductList({productList}: SubProductListProps) {
  const [cartItemsLength, setCartItemsLength] = useState(0);
  const [productInCart, setProductInCart] = useState([]);
  const {user}  = useMainStorage();

  useEffect(() => {
    setCartItemsLength(productInCart.length || 0);
    if (user && user.id) {
      getData();
    }
  }, [user]);

  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/cart/${user.id}`);
      setCartItemsLength(res.data.cartItems.length || 0);
      setProductInCart(res.data.cartItems);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList
        .filter((product) => product.subProduct)
        .map((product) => (
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
              {cartItemsLength > 0 && (
                <Button className="min-w-[100px]">
                  <Link href={`/product/${product.id}`}>Select</Link>
                </Button>
              )}
            </CardFooter>
          </div>
        ))}
    </div>
  );
}

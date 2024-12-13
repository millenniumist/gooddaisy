"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { InfoIcon, Flower } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useMainStorage } from '@/store/mainStorage';

import axios from 'axios';

export default function SubProductList({ productList }) {
  const [cartItemsLength, setCartItemsLength] = useState(0);
  const [productInCart, setProductInCart] = useState([]);
  const { user } = useMainStorage();

  useEffect(() => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {productList
        .filter((product) => product.subProduct)
        .sort((a, b) => a.price - b.price)
        .map((product) => (
          <Card key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{product.name}</CardTitle>
              <div className="flex justify-between items-center mt-2">
                <Badge variant="secondary" className="text-sm">{product.dimensions}</Badge>
                <span className="text-lg font-semibold text-primary">฿{product.price.toLocaleString()}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <NextImage
                        src={image.url}
                        alt={`${product.name} - Image ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-[250px] object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {product.images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <InfoIcon size={16} />
                <span>Preservation: {product.preservationMethod}</span>
              </div>
              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              )}
              <div className="flex justify-between items-center w-full mt-2">
                <Button variant="outline" size="sm">
                  <Flower className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
                <Button asChild>
                  <Link href={`/product/${product.id}`}>Select</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}

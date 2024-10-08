import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  images: { url: string }[];
}

export default function Product({ id, name, price, images }: ProductProps) {
  return (
    <Card key={id} className="rounded-xl border bg-card text-card-foreground shadow" >
      <CardHeader>
        {/* <pre>{JSON.stringify({ id, name, price, images }, null, 2)}</pre> */}
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="relative ">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image.url}
                  alt={`${name} - Image ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover rounded-md "
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </Carousel>
      </CardContent>
    </Card>
  );
}

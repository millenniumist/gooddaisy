import { Suspense } from 'react';
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import prisma from '@/config/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Product from '@/app/page-components/Product';

async function fetchProduct(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
    include: { images: true },
  });
  return product;
}

async function addToCart(formData: FormData) {
  'use server'
  const productId = formData.get('productId') as string;
  const colorRefinement = formData.get('colorRefinement') === 'on';
  const attachedItem = formData.get('attachedItem') === 'on';
  const customText = formData.get('customText') as string;
  const price = parseFloat(formData.get('price') as string);
  const name = formData.get('name') as string;
  const userId = 1; // Replace with actual user ID from authentication

  try {
    await prisma.orderItem.create({
      data: {
        name,
        price,
        colorRefinement,
        message: customText,
        addOnItem: attachedItem,
        productId: Number(productId),
        userId,
      },
    });

    revalidatePath('/production');
  } catch (error) {
    console.error('Failed to add item to cart:', error);
  }
}

async function checkout(formData: FormData) {
  'use server'
  await addToCart(formData);
  redirect('/cart');
}

export default async function ProductionPage({ params }: { params: { productId: number } }) {
  const product = await fetchProduct(params.productId);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Customize Your Product</h1>
      <ProductDisplay product={product} />
      <CustomizationForm product={product} />
    </div>
  );
}

function ProductDisplay({ product }: { product: any }) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-xl mb-4">Price: ฿{product.price}</p>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="w-full flex justify-center">
            <Product 
             id={product.id} name={product.name} price={product.price} images={product.images.map((image: {url:string}, index: number) => ({
              key: index,
              url: image.url,
            }))}
            > 

            </Product>
          </div>
        </div>
      </div>
    );
  }

function CustomizationForm({ product }: { product: any }) {
  return (
    <Card>
      <form>
        <CardHeader>
          <CardTitle>Product Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="name" value={product.name} />
          <input type="hidden" name="price" value={product.price} />
          
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Color Refinement: <span className="text-sm"> {`(+฿${product.colorRefinement})`}</span></h2>
            <div className="flex items-center space-x-2">
              <Switch id="colorRefinement" name="colorRefinement" />
              <Label htmlFor="colorRefinement">Enable Color Refinement</Label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">2. Attach Item</h2>
            <div className="flex items-center space-x-2">
              <Switch id="attachedItem" name="attachedItem" />
              <Label htmlFor="attachedItem">Attach Item</Label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">3. Custom Text</h2>
            <Input type="text" name="customText" placeholder="Enter your custom text" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full gap-2">
            <Button formAction={addToCart} className="bg-slate-500 min-h-12 flex-grow-[1]">Add to Cart</Button>
            <Button formAction={checkout} className="flex flex-col min-h-12 flex-grow-[2]">
              <p>Check Out</p>
              <p>฿{product.price}</p>
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
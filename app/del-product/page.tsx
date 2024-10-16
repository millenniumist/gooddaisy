import { ToastWrapper } from "@/components/ui/ToastWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import prisma from "@/config/prisma";
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});
interface Product {
  id: number;
  name: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

async function deleteProduct(formData: FormData) {
  'use server'
  console.log("deleteProduct called");
  const productId = formData.get('productId');
  if (!productId) {
    return { error: 'Product ID is required' };
  }

  try {
    const image = await prisma.image.findFirst({
      where: { productId: Number(productId) },
      select: { url: true }
    });

    await prisma.$transaction([
      prisma.image.deleteMany({ where: { productId: Number(productId) } }),
      prisma.orderItem.deleteMany({ where: { productId: Number(productId) } }),
      prisma.product.delete({ where: { id: Number(productId) } }),
    ]);

    if (image && image.url) {
      await cloudinary.uploader.destroy(image.url);
    }

    revalidatePath('/del-product');
    return { success: 'Product and associated image deleted successfully' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: 'Failed to delete product' };
  }
}

export default async function DeleteProductPage() {
  const products = await getProducts();

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Delete Product</CardTitle>
        <CardDescription>Select a product to delete</CardDescription>
      </CardHeader>
      <CardContent>
        <ToastWrapper onSubmit={deleteProduct}>
            <Select name="productId">
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">Delete Product</Button>
        </ToastWrapper>
      </CardContent>
    </Card>
  );
}
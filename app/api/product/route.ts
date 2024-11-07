import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';
export async function POST(request: Request) {
  try {
    const { 
      name, 
      description,
      price, 
      colorRefinement, 
      message, 
      addOnItem, 
      allowColorRefinement, 
      allowMessage, 
      allowAddOnItem, 
      images,
      subProduct 
    } = await request.json();

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        colorRefinement: Number(colorRefinement),
        message: Number(message),
        addOnItem: Number(addOnItem),
        allowColorRefinement,
        allowMessage,
        allowAddOnItem,
        subProduct,
        images: {
          create: images.map((url: string) => ({
            url,
            altText: `Image for ${name}`
          }))
        }
      },
      include: {
        images: true
      }
    });

    return NextResponse.json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    }); 
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}


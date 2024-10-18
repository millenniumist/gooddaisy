import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log("Received formData:", Object.fromEntries(formData));
    
    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const colorRefinement = Number(formData.get('colorRefinement'));
    const message = Number(formData.get('message'));
    const addOnItem = Number(formData.get('addOnItem'));
    const allowColorRefinement = formData.get('allowColorRefinement') === 'true';
    const allowMessage = formData.get('allowMessage') === 'true';
    const allowAddOnItem = formData.get('allowAddOnItem') === 'true';
    const images = formData.getAll('images').map(item => item.toString());

    const product = await prisma.product.create({
      data: {
        name,
        price,
        colorRefinement,
        message,
        addOnItem,
        allowColorRefinement,
        allowMessage,
        allowAddOnItem,
        images: {
          create: images.map(url => ({
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

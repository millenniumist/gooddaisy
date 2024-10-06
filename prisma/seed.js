
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// admin adminPassword123

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      userId: 'LINE123456',
      displayName: 'John Doe',
      pictureUrl: 'https://example.com/john.jpg',
      statusMessage: 'Hello, I love preserved flowers!',
      address: '123 Flower St, Garden City',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      userId: 'LINE789012',
      displayName: 'Jane Smith',
      pictureUrl: 'https://example.com/jane.jpg',
      statusMessage: 'Preserved flowers are my passion',
      address: '456 Petal Ave, Bloom Town',
    },
  });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      name: 'Rose Bouquet',
      price: 59.99,
      addOnPrice: 10.00,
      colorRefinement: true,
      addOnItem: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Sunflower Frame',
      price: 39.99,
      addOnPrice: 5.00,
      colorRefinement: false,
      addOnItem: true,
    },
  });

  // Seed Orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      productionStatus: 'DRIED',
      paymentStatus: 'HALF_PAID',
      orderItems: {
        create: [
          {
            name: 'Preserved Rose Bouquet',
            status: 'DRIED',
            price: 59.99,
            colorRefinement: true,
            message: 'Happy Anniversary!',
            addOnItem: 'Gift Box',
            productId: product1.id,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      productionStatus: 'PATTERN_CONFIRMED',
      paymentStatus: 'FULL_PAID',
      orderItems: {
        create: [
          {
            name: 'Sunflower Frame',
            status: 'PATTERN_CONFIRMED',
            price: 39.99,
            colorRefinement: false,
            addOnItem: 'Stand',
            productId: product2.id,
          },
        ],
      },
    },
  });

  // Seed Admin
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('adminPassword123', saltRounds);

  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

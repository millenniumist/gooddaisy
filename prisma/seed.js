  import { PrismaClient } from '@prisma/client';
  import bcrypt from 'bcrypt';

  const prisma = new PrismaClient();

  async function main() {
    // Check if users already exist
    const existingUser1 = await prisma.user.findUnique({ where: { userId: 'LINE123456' } });
    const existingUser2 = await prisma.user.findUnique({ where: { userId: 'LINE789012' } });
    const existingAdmin = await prisma.user.findUnique({ where: { userId: 'ADMIN' } });

    // Seed Users
    let user1, user2, admin;

    if (!existingUser1) {
      user1 = await prisma.user.create({
        data: {
          userId: 'LINE123456',
          displayName: 'John Doe',
          pictureUrl: 'https://example.com/john.jpg',
          statusMessage: 'Hello, I love preserved flowers!',
          address: '123 Flower St, Garden City',
        },
      });
    } else {
      user1 = existingUser1;
    }

    if (!existingUser2) {
      user2 = await prisma.user.create({
        data: {
          userId: 'LINE789012',
          displayName: 'Jane Smith',
          pictureUrl: 'https://example.com/jane.jpg',
          statusMessage: 'Preserved flowers are my passion',
          address: '456 Petal Ave, Bloom Town',
        },
      });
    } else {
      user2 = existingUser2;
    }

    // Seed Admin
    if (!existingAdmin) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('adminPassword123', saltRounds);

      admin = await prisma.user.create({
        data: {
          userId: 'admin',
          displayName: 'Admin User',
          password: hashedPassword,
          isAdmin: true,
        },
      });
    } else {
      admin = existingAdmin;
    }

    // Seed Products
    const product1 = await prisma.product.create({
      data: {
        name: 'Rose Bouquet',
        price: 59.99,
        allowColorRefinement: true,
        allowMessage: true,
        allowAddOnItem: true,
        colorRefinement: 200,
        message: 0,
        addOnItem: 0,
        images: {
          create: [
            { url: 'https://example.com/rose-bouquet-1.jpg', altText: 'Rose Bouquet Image 1' },
            { url: 'https://example.com/rose-bouquet-2.jpg', altText: 'Rose Bouquet Image 2' },
          ],
        },
      },
    });

    const product2 = await prisma.product.create({
      data: {
        name: 'Sunflower Frame',
        price: 39.99,
        allowColorRefinement: true,
        allowMessage: true,
        allowAddOnItem: true,
        colorRefinement: 200,
        message: 0,
        addOnItem: 0,
        images: {
          create: [
            { url: 'https://example.com/sunflower-frame-1.jpg', altText: 'Sunflower Frame Image 1' },
            { url: 'https://example.com/sunflower-frame-2.jpg', altText: 'Sunflower Frame Image 2' },
          ],
        },
      },
    });

    // Seed Orders
    const order1 = await prisma.order.create({
      data: {
        userId: user1.id,
        productionStatus: 'DRIED',
        paymentStatus: 'HALF_PAID',
        totalPrice: 59.99,
      },
    });

    const order2 = await prisma.order.create({
      data: {
        userId: user2.id,
        productionStatus: 'PATTERN_CONFIRMED',
        paymentStatus: 'FULL_PAID',
        totalPrice: 39.99,
      },
    });

    // Seed OrderItems
    const orderItem1 = await prisma.orderItem.create({
      data: {
        name: 'Preserved Rose Bouquet',
        status: 'DRIED',
        price: 59.99,
        colorRefinement: true,
        message: 'Happy Anniversary!',
        addOnItem: true,
        note: 'Please handle with care',
        productId: product1.id,
        userId: user1.id,
        orderId: order1.id
      },
    });

    const orderItem2 = await prisma.orderItem.create({
      data: {
        name: 'Sunflower Frame',
        status: 'PATTERN_CONFIRMED',
        price: 39.99,
        colorRefinement: false,
        addOnItem: true,
        note: 'Gift wrapping requested',
        productId: product2.id,
        userId: user2.id,
        orderId: order2.id
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
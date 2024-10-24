import { NextResponse } from 'next/server';

import puppeteer from 'puppeteer';
import prisma from '@/config/prisma';
import { subMonths, format } from 'date-fns';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderIds = searchParams.get('orderId');

  if (orderIds && orderIds !== 'all') {
    try {
      const orderIdArray = orderIds.split(',').map(id => parseInt(id));
      const orders = await prisma.order.findMany({
        where: { id: { in: orderIdArray } },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (orders.length === 0) {
        return NextResponse.json({ error: 'No orders found' }, { status: 404 });
      }

      const formatOrderId = (order) => {
        const createdDate = new Date(order.createdDate);
        const monthYear = format(createdDate, 'M-yy');
        const ordersInSameMonth = orders.filter(o =>
          format(new Date(o.createdDate), 'M-yy') === monthYear
        );
        const orderIndex = ordersInSameMonth.findIndex(o => o.id === order.id) + 1;
        return `${orderIndex}-${monthYear}`;
      };
      // const browser = await puppeteer.launch({
      //   args:chromium.args,
      //   defaultViewport: chromium.defaultViewport,
      //   executablePath: await chromium.executablePath,
      //   headless: true,
      //   ignoreHTTPSErrors: true,
      // });
      // const browser = await puppeteer.launch({
      //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //   executablePath: process.env.NODE_ENV === 'development' 
      //     ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      //     : await chromium.executablePath('/tmp/chromium'),
      //   headless: true, // Changed from "new" to true for better compatibility
      //   defaultViewport: { width: 1920, height: 1080 }
      // });
      const browser = await puppeteer.launch({ headless: true, executablePath: process.env.NODE_ENV === 'development' 
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : "/home/sbx_user1051/.cache/puppeteer" });



      await new Promise(resolve => setTimeout(resolve, 400));
      const page = await browser.newPage();

      try {
        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              ${orders.map(order => `
                <h1>Order #${formatOrderId(order)}  </h1>
                <p>Customer: ${order.user.displayName} </p>
                <p> Address: ${order.user.address}</p>
                <p>Payment: ${order.paymentStatus}</p>
                <h2>Order Items</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Color Refinement</th>
                      <th>Message</th>
                      <th>Add-On Item</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.orderItems.map(item => `
                      <tr>
                        <td>${item.product.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${item.status}</td>
                        <td>${item.colorRefinement ? 'Yes' : 'No'}</td>
                        <td>${item.message || 'N/A'}</td>
                        <td>${item.addOnItem ? 'Yes' : 'No'}</td>
                        <td>${item.note || 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                <h3>Total Price: ${order.totalPrice.toFixed(2)}</h3>
              `).join('<div style="page-break-after: always;"></div>')}
            </body>
          </html>
        `;

        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4' });

        return new NextResponse(pdf, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="filtered-orders.pdf"`,
          },
        });
      } finally {
        if (page) await page.close();
        if (browser) await browser.close();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
  } else {
    try {
      const threeMonthsAgo = subMonths(new Date(), 3);
      const orders = await prisma.order.findMany({
        where: {
          createdDate: {
            gte: threeMonthsAgo,
          },
        },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdDate: 'desc',
        },
      });
      return NextResponse.json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
  }
}



import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import prisma from "@/config/prisma";
import { subMonths, format } from "date-fns";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderIds = searchParams.get("orderId");

  if (orderIds && orderIds !== "all") {
    try {
      const orderIdArray = orderIds.split(",").map((id) => parseInt(id));
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
        return NextResponse.json({ error: "No orders found" }, { status: 404 });
      }

      const chromiumPack =
        "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";
      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(chromiumPack),
        headless: true,
        ignoreHTTPSErrors: true,
      });

      await new Promise((resolve) => setTimeout(resolve, 400));
      const page = await browser.newPage();

      try {
        const htmlContent = `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
  </head>
  <body>
    ${orders
      .map(
        (order) => `
      <table>
        <thead>
          <tr>
            <th>Order Details</th>
            <th>Product Info</th>
            <th>Options</th>
            <th>Status</th>
            <th>Customization</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems
            .map(
              (item) => `
            <tr>
              <td>
                <strong>Order #:</strong> ${order?.customId || "N/A"}<br>
                <strong>Customer:</strong> ${
                  order.user?.displayName || order.user?.userId || "N/A"
                }<br>
                <strong>Address:</strong> ${order.user.address}<br>
                <strong>Payment:</strong> ${order.paymentStatus}
              </td>
              <td>${item.product.name}</td>
              <td>${item.variant ? item.variant.toUpperCase() : "N/A"}</td>
              <td>${item.status}</td>
              <td>
                <strong>Color Refinement:</strong> ${item.colorRefinement ? "Yes" : "No"}<br>
                <strong>Message:</strong> ${item.message || "N/A"}<br>
                <strong>Add-On Item:</strong> ${item.addOnItem ? "Yes" : "No"}<br>
                <strong>Note:</strong> ${item.note || "N/A"}
              </td>
              <td>
                <strong>Item Price:</strong> ${item.price.toFixed(2)}<br>
                <strong>Order Total:</strong> ${order.totalPrice.toFixed(2)}
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `
      )
      .join('<div style="page-break-after: always;"></div>')}
  </body>
</html>
`;

        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: "A4" });

        return new NextResponse(pdf, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="filtered-orders.pdf"`,
          },
        });
      } finally {
        if (page) await page.close();
        if (browser) await browser.close();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
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
          createdDate: "desc",
        },
      });
      return NextResponse.json({ orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
  }
}

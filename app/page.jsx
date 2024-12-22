import prisma from "@/config/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import MainProductList from "./page-components/map-components/MainProductList";
import SubProductList from "./page-components/map-components/SubProductList";

export default async function ProductShowcase() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  let userData = null;

  if (token) {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    if (user) {
      userData = {
        id: user.id,
        userId: user.userId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl,
        statusMessage: user.statusMessage,
        isAdmin: user.isAdmin,
        createdDate: user.createdDate
      };
    }
  }

  const productList = await prisma.product.findMany({
    include: { images: true },
  });

  return (
    <div className="container mx-auto py-16 px-4 ">
      <section>
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Select Your Flower Preservation Mold
        </h1>
        <MainProductList productList={productList} userData={userData} />
      </section>
      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Enhance Your Experience
        </h2>
        <SubProductList productList={productList} userData={userData} />
      </section>
    </div>
  );
}

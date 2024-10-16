"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMainStorage } from "@/store/mainStorage";

interface CartItem {
  id: number;
  product: {
    name: string;
    images?: { url: string }[];
  };
  colorRefinement?: boolean;
  message?: string;
  addOnItem?: boolean;
  price: number;
}

export default function CartPage() {
  useEffect(() => {
    getData();
  }, []);
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const {setCheckOutAlready,user} = useMainStorage()
  const checkout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}api/cart/`, {
        userId: user.id,
      });
      setCheckOutAlready(true)
      router.push("/cart/address");
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const response = await axios.get<{ cartItems: CartItem[] }>(`${process.env.NEXT_PUBLIC_URL}api/cart/${user.id}`);
    setCartItems(response.data.cartItems);

  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}api/cart/${id}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => setEditMode(!editMode)} className="cursor-pointer">
                <SquarePen className="w-3" />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {!editMode ? (
                    <p className="w-4">{index + 1}</p>
                  ) : (
                    <Trash2 className="text-red-500 w-4 cursor-pointer" onClick={() => handleDelete(item.id)} />
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-3">
                  {item.product.images && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={50}
                      height={50}
                    />
                  )}
                  {
                    <div>
                      <p> {item.product.name}</p>
                      <ul className="px-4">
                        {item.colorRefinement && (
                          <li className="text-xs list-disc">Color Refinement</li>
                        )}
                        {item.message && (
                          <li className="text-xs list-disc">Message: {item.message}</li>
                        )}
                        {item.addOnItem && <li className="text-xs list-disc">Attached Item</li>}
                      </ul>
                    </div>
                  }
                </TableCell>
                <TableCell className="text-center">1</TableCell>
                <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>
        </div>
        <Button onClick={checkout}>Checkout</Button>
      </CardFooter>
    </Card>
  );
}

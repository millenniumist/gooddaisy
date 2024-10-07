"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { get } from "http";
import { useEffect,useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    getData()
  },[])
  
  const getData = async () => {
    const response = await axios.get("http://localhost:3000/api/cart")
    setCartItems(response.data.cartItems);
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price , 0).toFixed(2);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        {/* <pre>{JSON.stringify(cartItems, null, 2)}</pre> */}
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-3">
                  {item.product.images && item.product.images.length > 0 && (
                    <Image src={item.product.images[0].url} alt={item.product.name} width={50} height={50} />
                  )}
                  {(<div>
                   <p> {item.product.name}</p>
                  <ul className="px-4">
                  {item.colorRefinement&&<li className="text-xs list-disc">Color Refinement</li>}
                   {item.message&&<li className="text-xs list-disc">Message:  + {item.message}</li>}
                   {item.addOnItem&&<li className="text-xs list-disc">Attached Item</li>}
                  </ul>
                  </div>)}
                </TableCell>
                <TableCell className="text-center">
                  1
                </TableCell>
                <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">${(item.price ).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>
        </div>
        <Button>Checkout</Button>
      </CardFooter>
    </Card>
  );
}

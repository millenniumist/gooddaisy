"use client";
export const revalidate = 0
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
import SubProductList from "../page-components/map-components/SubProductList";
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

interface CartItem {
  id: number;
  product: {
    name: string;
    images?: { url: string }[];
    subProduct: boolean;
  };
  colorRefinement?: boolean;
  message?: string;
  addOnItem?: boolean;
  price: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true); // State for loading data
  const [checkoutLoading, setCheckoutLoading] = useState(false); // State for checkout loading
  const {  user } = useMainStorage();
  
  const getData = async () => {
    if (user?.id) {
      try {
        const response = await axios.get<{ cartItems: CartItem[] }>(
          `${process.env.NEXT_PUBLIC_URL}api/cart/${user.id}`
        );
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    } else {
      console.log("User ID not available");
      setLoading(false); // Set loading to false if user ID is not available
    }
  };

  useEffect(() => {
    if (user?.id) {
      getData();
      fetchProductList();
    }
  }, [user?.id]);

  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [productList, setProductList] = useState([]);
  
  const checkout = async () => {
    setCheckoutLoading(true); // Start checkout loading
    try {

      router.push("/cart/address");
    } catch (error) {
      console.log(error);
    } finally {
      setCheckoutLoading(false); // End checkout loading
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_URL}api/cart/${id}`);
      if(cartItems.filter((item)=>!item.product.subProduct).length>1){
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        console.log("still has main")
        return
      }
      else{
        await axios.delete(`${process.env.NEXT_PUBLIC_URL}api/cart/`);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const fetchProductList = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/product`);
      setProductList(response.data.products);
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };
  console.log(cartItems)
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Display skeleton loader while loading
          <Skeleton count={5} height={40} />
        ) : (
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
                      <Trash2
                        className="text-red-500 w-4 cursor-pointer"
                        onClick={() => handleDelete(item.id)}
                      />
                    )}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    {item.product.images && (
                      <Image
                        src={item.product.images[0]?.url}
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
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <p className="text-lg font-semibold">Total: ${calculateTotal()}</p>
        </div>
        <Button onClick={checkout} disabled={checkoutLoading}>
          {checkoutLoading ? "Processing..." : "Checkout"}
        </Button>
      </CardFooter>
      {cartItems.length !== 0 && (
        <>
          <CardTitle className="p-4">You're eligible to buy these special product!</CardTitle>
          <SubProductList productList={productList}  />
        </>
      )}
    </Card>
  );
}

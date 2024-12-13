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
import SubProductList from "../page-components/map-components/SubProductList";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { user, isLoggedIn } = useMainStorage();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [productList, setProductList] = useState([]);
  const [localCart, setLocalCart] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('gooddaisyCart')) || [];
    }
    return [];
  });
  
  const getData = async () => {
    if (isLoggedIn && user?.id) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}api/cart/${user.id}`);
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
      const localCart = localStorage.getItem('gooddaisyCart');
      if (localCart) {
        // Transform local storage data to match API structure
        const parsedCart = JSON.parse(localCart).map(item => ({
          ...item,
          product: {
            name: item.name,
            images: item.images || [],
            subProduct: item.subProduct || false
          }
        }));
        setCartItems(parsedCart);
      }
    }
    setLoading(false);
  };
  

  useEffect(() => {
    getData();
    fetchProductList();
  }, [user?.id, isLoggedIn]);

// Update checkout to handle local cart
const checkout = async () => {
  setCheckoutLoading(true);
  try {
    if (!isLoggedIn) {
      // Store cart items in session storage before redirecting
      sessionStorage.setItem('pendingCart', localStorage.getItem('gooddaisyCart'));
      router.push("/login");
      return;
    }
    router.push("/cart/address");
  } finally {
    setCheckoutLoading(false);
  }
};

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleDelete = async (id) => {
    if (isLoggedIn) {
      try {
        if(cartItems.filter((item)=>!item.product.subProduct).length>1){
          await axios.delete(`${process.env.NEXT_PUBLIC_URL}api/cart/${id}`);
          setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
          return;
        } else {
          await axios.delete(`${process.env.NEXT_PUBLIC_URL}api/cart/`);
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    } else {
      const updatedCart = localCart.filter(item => item.id !== id);
      localStorage.setItem('gooddaisyCart', JSON.stringify(updatedCart));
      setLocalCart(updatedCart);
      setCartItems(updatedCart.map(item => ({
        ...item,
        product: {
          name: item.product.name,
          images: item.product.images,
          subProduct: item.product.subProduct
        }
      })));
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
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
          <SubProductList productList={productList} />
        </>
      )}
    </Card>
  );
}

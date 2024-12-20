"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Product from "@/app/page-components/Product";
import axios from "axios";  
import { useRouter } from "next/navigation";
import { useMainStorage } from "@/store/mainStorage";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { Flower, Palette, MessageSquare, Package } from "lucide-react";

export default function ProductCustomization({ params }: { params: { productId: string } }) {
  const [colorRefinement, setColorRefinement] = useState(false);
  const [attachedItem, setAttachedItem] = useState(false);
  const [customText, setCustomText] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { user, isLoggedIn } = useMainStorage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const productId = use(params).productId

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/product/${productId}`);
        setProduct(response.data);
        setTotalPrice(Number(response.data.price));
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const data = {
        colorRefinement: product.allowColorRefinement ? colorRefinement : false,
        addOnItem: product.allowAddOnItem ? attachedItem : false,
        message: product.allowMessage ? customText : "",
        productId: Number(productId),
        price: Number(totalPrice),
        name: product.name,
        userId: user.id
      };
      await axios.post(`${process.env.NEXT_PUBLIC_URL}api/product/${productId}`, data);
      setAddedToCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      if(addedToCart) {
        router.push("/cart");
        return;
      }
      const data = {
        colorRefinement: colorRefinement,
        addOnItem: attachedItem,
        message: customText,
        productId: Number(productId),
        price: Number(totalPrice),
        name: product.name,
        userId: user.id
      };
      await axios.post(`${process.env.NEXT_PUBLIC_URL}api/product/${productId}`, data);
      router.push("/cart");
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setCheckingOut(false);
    }
  }

  const updateTotalPrice = (addition: number) => setTotalPrice((prevTotal) => Number((prevTotal + addition).toFixed(2)));

  const handleColorRefinementChange = (isChecked: boolean) => {
    const newColorRefinement = !colorRefinement;
    updateTotalPrice(newColorRefinement ? Number(product.colorRefinement) : -Number(product.colorRefinement));
    setColorRefinement(newColorRefinement);
  };

  const handleItemAttach = (checked: boolean) => setAttachedItem(checked);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton height={300} className="mb-6" />
        <Skeleton height={50} className="mb-4" />
        <Skeleton height={100} count={3} className="mb-4" />
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Customize Your Preserved Flower Arrangement</h1>
      <p className="text-center mb-8 text-muted-foreground">{product.description}</p>
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg shadow-lg mb-8">
        <Product 
          id={product.id}
          name={product.name}
          price={product.price}
          images={product.images.map((image: any, index: number) => ({ key: index, url: image.url }))}
        />
      </div>
      <Card className="mt-8 border-2 border-primary/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="text-2xl text-primary">Product Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {product.allowColorRefinement && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <Palette className="mr-2" /> Color Refinement <span className="text-sm ml-2 text-muted-foreground">{`(+฿${product.colorRefinement})`}</span>
              </h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="color-refinement"
                  checked={colorRefinement}
                  onCheckedChange={handleColorRefinementChange}
                />
                <Label htmlFor="color-refinement" className="text-muted-foreground">Enable Color Refinement</Label>
              </div>
            </div>
          )}

          {product.allowAddOnItem && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <Package className="mr-2" /> Attach Item
              </h2>
              <div className="flex items-center space-x-2">
                <Switch id="attach-item" checked={attachedItem} onCheckedChange={handleItemAttach} />
                <Label htmlFor="attach-item" className="text-muted-foreground">Attach Item</Label>
              </div>
            </div>
          )}

          {product.allowMessage && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <MessageSquare className="mr-2" /> Custom Text
              </h2>
              <Input
                type="text"
                placeholder="Enter your custom text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="border-primary/20 focus:border-primary"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-pink-50 to-purple-50 p-6">
          <div className="flex w-full gap-4">
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground min-h-12 flex-grow transition-all duration-300"
              onClick={handleAddToCart} 
              disabled={addingToCart || addedToCart}
            >
              {addingToCart ? "Adding..." : addedToCart ? "Added to Cart" : "Add to Cart"}
            </Button>
            <Button  
              onClick={handleCheckout} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex flex-col min-h-12 flex-grow transition-all duration-300"
              disabled={checkingOut}
            >
              <p>{checkingOut ? "Processing..." : "Check Out"}</p>
              <p className="text-sm">฿{totalPrice.toLocaleString()}</p>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
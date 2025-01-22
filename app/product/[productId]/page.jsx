"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMainStorage } from "@/store/mainStorage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Flower, Palette, MessageSquare, Package } from "lucide-react";
import Product from "../../page-components/Product";

export default function ProductCustomization({ params }) {
  const [colorRefinement, setColorRefinement] = useState(false);
  const [attachedItem, setAttachedItem] = useState(false);
  const [customText, setCustomText] = useState("");
  const [product, setProduct] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { user, isLoggedIn } = useMainStorage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantError, setVariantError] = useState(false);
  const [localCart, setLocalCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("gooddaisyCart")) || [];
    }
    return [];
  });
  const { productId } = React.use(params);
  useEffect(() => {
    if (product) {
      const basePrice = selectedVariant?.price || product.price;
      setTotalPrice(basePrice);
    }
  }, [selectedVariant, product]);

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
  console.log(product);
  const handleAddToCart = async () => {
    if (product.hasVariants && !selectedVariant) {
      setVariantError(true);
      return;
    }
    setVariantError(false);
    setAddingToCart(true);
    const cartItem = {
      id: Date.now(),
      product: {
        id: product.id,
        name: product.name,
        images: product.images.map(img => ({
          url: img.url,
        })),
        subProduct: product.subProduct || false,
      },
      variant: selectedVariant?.name || null,
      colorRefinement: product.allowColorRefinement ? colorRefinement : false,
      addOnItem: product.allowAddOnItem ? attachedItem : false,
      message: product.allowMessage ? customText : "",
      productId: Number(productId),
      price: Number(totalPrice),
      name: product.name
    };
  
    if (isLoggedIn) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_URL}api/product/${productId}`, {
          ...cartItem,
          userId: user.id,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      const updatedCart = [...localCart, cartItem];
      localStorage.setItem('gooddaisyCart', JSON.stringify(updatedCart));
      setLocalCart(updatedCart);
    }
    
    setAddedToCart(true);
    setAddingToCart(false);
  };
  
  

  //  handleCheckout function
  const handleCheckout = async () => {
    if (product.hasVariants && !selectedVariant) {
      setVariantError(true);
      return;
    }
  
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
  
    setCheckingOut(true);
    try {
      if (!addedToCart) {
        await handleAddToCart();
      }
      router.push("/cart");
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setCheckingOut(false);
    }
  };
  

  const updateTotalPrice = (addition) =>
    setTotalPrice((prevTotal) => Number((prevTotal + addition).toFixed(2)));

  const handleColorRefinementChange = () => {
    const newColorRefinement = !colorRefinement;
    updateTotalPrice(
      newColorRefinement ? Number(product.colorRefinement) : -Number(product.colorRefinement)
    );
    setColorRefinement(newColorRefinement);
  };

  const handleItemAttach = (checked) => setAttachedItem(checked);

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
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Customize Your Preserved Flower Arrangement
      </h1>
      <p className="text-center mb-8 text-muted-foreground">{product.description}</p>
      <div className=" p-6 rounded-lg shadow-lg mb-8">
        <Product
          id={product.id}
          name={product.name}
          price={product.price}
          images={product.images.map((image, index) => ({ key: index, url: image.url }))}
        />
      </div>
      <Card className="mt-8 border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Product Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {product.hasVariants && product.variants.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <Flower className="mr-2" /> Product Options
              </h2>
              <Select
                onValueChange={(value) => {
                  setVariantError(false);
                  const variant = product.variants.find((v) => v.name === value);
                  setSelectedVariant(variant);
                }}
                required
              >
                <SelectTrigger className={`w-full ${variantError ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.name}>
                      {variant.name.toUpperCase()} {variant.price && `- ฿${variant.price}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {variantError && (
                <p className="text-red-500 text-sm mt-1">Please select a product option</p>
              )}
            </div>
          )}

          {product.allowColorRefinement && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <Palette className="mr-2" /> Color Refinement{" "}
                <span className="text-sm ml-2 text-muted-foreground">{`(+฿${product.colorRefinement})`}</span>
              </h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="color-refinement"
                  checked={colorRefinement}
                  onCheckedChange={handleColorRefinementChange}
                />
                <Label htmlFor="color-refinement" className="text-muted-foreground">
                  Enable Color Refinement
                </Label>
              </div>
            </div>
          )}

          {product.allowAddOnItem && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <Package className="mr-2" /> Attach Item
              </h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="attach-item"
                  checked={attachedItem}
                  onCheckedChange={handleItemAttach}
                />
                <Label htmlFor="attach-item" className="text-muted-foreground">
                  Attach Item
                </Label>
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
        <CardFooter className=" p-6">
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

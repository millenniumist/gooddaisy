"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Product from "@/app/page-components/Product";
import axios from "axios";  
import { useRouter } from "next/navigation";
import { useMainStorage } from "@/store/mainStorage";

export default function ProductCustomization({ params }: { params: { productId: number } }) {
  const [colorRefinement, setColorRefinement] = useState(false);
  const [attachedItem, setAttachedItem] = useState(false);
  const [customText, setCustomText] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { user, isLoggedIn } = useMainStorage();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/product/${params.productId}`);
        setProduct(response.data);
        setTotalPrice(Number(response.data.price));
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProduct();
  }, [params.productId]);

  const handleAddToCart = async () => {
    const data = {
      colorRefinement: product.allowColorRefinement ? colorRefinement : false,
      addOnItem: product.allowAddOnItem ? attachedItem : false,
      message: product.allowMessage ? customText : "",
      productId: Number(params.productId),
      price: Number(totalPrice),
      name: product.name,
      userId: user.id
    };
    await axios.post(`${process.env.NEXT_PUBLIC_URL}api/product/${params.productId}`, data);
    setAddedToCart(true);
  };
  const handleCheckout = async () => {
    try {
      if(addedToCart) return router.push("/cart");
      const data = {colorRefinement:colorRefinement, addOnItem:attachedItem, message:customText, productId: Number(params.productId), price:Number(totalPrice), name:product.name, userId:user.id};
      // console.log(data);
      await axios.post(`${process.env.NEXT_PUBLIC_URL}api/product/${params.productId}`, data);

      router.push("/cart")
      
    } catch (error) {
      console.log(error)
    }
  }
  const updateTotalPrice = (addition: number) => setTotalPrice((prevTotal) => Number((prevTotal + addition).toFixed(2)));

  const handleColorRefinementChange = (isChecked: boolean) => {
    const newColorRefinement = !colorRefinement;
    updateTotalPrice(newColorRefinement ? Number(product.colorRefinement) : -Number(product.colorRefinement));
    setColorRefinement(newColorRefinement);
  };
  const handleItemAttach = (checked: boolean) => setAttachedItem(checked);


  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Customize Your Product</h1>
      <Product
        id={product.id}
        name={product.name}
        price={product.price}
        images={product.images.map((image: any, index: number) => ({ key: index, url: image.url }))}
      />
      <Card>
        <CardHeader>
          <CardTitle>Product Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {product.allowColorRefinement && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Color Refinement: <span className="text-sm"> {`(+฿${product.colorRefinement})`}</span></h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="color-refinement"
                  checked={colorRefinement}
                  onCheckedChange={handleColorRefinementChange}
                />
                <Label htmlFor="color-refinement">Enable Color Refinement</Label>
              </div>
            </div>
          )}

          {product.allowAddOnItem && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Attach Item</h2>
              <div className="flex items-center space-x-2">
                <Switch id="attach-item" checked={attachedItem} onCheckedChange={handleItemAttach} />
                <Label htmlFor="attach-item">Attach Item</Label>
              </div>
            </div>
          )}

          {product.allowMessage && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Custom Text</h2>
              <Input
                type="text"
                placeholder="Enter your custom text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
        <div className="flex w-full gap-2">
            <Button className="bg-slate-500 min-h-12 flex-grow-[1]" onClick={handleAddToCart} disabled={addedToCart} style={{ opacity: addedToCart ? 0.5 : 1 }}>Add to Cart</Button>
            <Button  onClick={handleCheckout} className="flex flex-col min-h-12 flex-grow-[2]"><p>Check Out</p>
            <p>฿{totalPrice}</p>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

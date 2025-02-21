"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
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
  const [isCustomTextEnabled, setIsCustomTextEnabled] = useState(false);
  const [note, setNote] = useState("");

  console.log(product);

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
        images: product.images.map((img) => ({
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
      name: product.name,
      note: note,
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
      localStorage.setItem("gooddaisyCart", JSON.stringify(updatedCart));
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

  const handleItemAttach = (checked) => {
    setAttachedItem(checked);
    // Add price logic here if needed
    updateTotalPrice(checked ? Number(product.addOnItem || 0) : -Number(product.addOnItem || 0));
  };
  const handleCustomTextToggle = (checked) => {
    setIsCustomTextEnabled(checked);
    if (!checked) {
      setCustomText("");
    }
    updateTotalPrice(checked ? Number(product.message) : -Number(product.message));
  };

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
        Customize Your Order
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
          <CardTitle className="text-2xl text-primary">Optional Service บริการเสริม</CardTitle>
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
              <Collapsible>
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center text-primary">
                    <Palette className="mr-2" /> ย้อมสีดอกไม้ (เฉพาะชิ้นงานหลัก)
                    <span className="text-sm ml-2 text-muted-foreground">{`(+฿${product.colorRefinement})`}</span>
                  </h2>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="color-refinement"
                      checked={colorRefinement}
                      onCheckedChange={handleColorRefinementChange}
                    />
                    <Label htmlFor="color-refinement" className="text-muted-foreground">
                      เพิ่มการย้อมสี
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    การย้อมสี เป็นการย้อมสีดอกไม้ที่สีเปลี่ยนหลังจากอบแห้ง
                    (ไม่ได้ย้อมทุกดอกทุกสีในชิ้นงาน ทางร้านจะพิจารณาย้อมตามความเหมาะสม)
                  </p>
                  <div>
                    <p className="font-medium text-primary mb-2">แนะนำสำหรับ:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>ช่อดอกไม้ที่เริ่มเฉา เพราะสีอาจดูไม่สดใสติดน้ำตาล</li>
                      <li>
                        ดอกTropical หรือดอกไม้เขตร้อนที่อมน้ำมาก สีจะเปลี่ยนมากหลังแห้ง เช่น
                        คาลล่าลิลลี่ กล้วยไม้
                      </li>
                      <li>ช่อดอกไม้สีขาว เพราะสีจะเปลี่ยนเป็นสีเหลือง</li>
                      <li>ช่อดอกไม้สีแดงเข้ม เพราะสีจะเปลี่ยนเป็นสีดำ เช่น กุหลาบ</li>
                      <li>ดอกไม้ที่กลีบบางและสีอ่อน เพราะจะไม่เหลือเม็ดสี เช่น ทิวลิป</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-primary mb-2">ดอกไม้ที่ย้อมสีไม่ได้:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>ดอกไม้ที่ปล่อยแห้งตามธรรมชาติ</li>
                      <li>พวงมาลัย</li>
                    </ul>
                    <div className="mt-4">
                      <Image
                        src="https://res.cloudinary.com/ddcjkc1ns/image/upload/v1740125368/Before_uwbmhx.png"
                        alt="Color refinement example"
                        width={400}
                        height={300}
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {product.allowAddOnItem && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center text-primary">
                    <Package className="mr-2" /> เพิ่มรูป/การ์ด ฟรี (เฉพาะชิ้นงานหลัก)
                    <span className="text-sm ml-2 text-muted-foreground">{`(+฿${
                      product.addOnItem || 0
                    })`}</span>
                  </h2>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="attach-item"
                      checked={attachedItem}
                      onCheckedChange={handleItemAttach}
                    />
                    <Label htmlFor="attach-item" className="text-muted-foreground">
                      เพิ่มรูป/การ์ด
                    </Label>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>ลูกค้านำรูป/การ์ดมาให้ทางร้าน</li>
                    <li>รูปวางตรงกลางและล้อมด้วยดอกไม้ เหมือนตย.รูป</li>
                    <li>ไม่รับใส่ด้านหลังชิ้นงาน</li>
                    <li>
                      การใส่รูปจะทำให้พื้นที่การใส่ดอกไม้ลดลง ควรเลือกรูปทรงที่ใหญ่พอ
                      ที่สามารถใส่ได้ทั้งรูปและดอกไม้
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Image
                      src="https://res.cloudinary.com/ddcjkc1ns/image/upload/v1740125488/Attach_nyf8y1.jpg"
                      alt="Attachment example"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

          {product.allowMessage && (
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center text-primary">
                    <MessageSquare className="mr-2" /> เพิ่มข้อความ
                    <span className="text-sm ml-2 text-muted-foreground">{`(+฿${
                      product.message || 0
                    })`}</span>
                  </h2>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-custom-text"
                      checked={isCustomTextEnabled}
                      onCheckedChange={handleCustomTextToggle}
                    />
                    <Label htmlFor="enable-custom-text" className="text-muted-foreground">
                      เพิ่มข้อความ
                    </Label>
                  </div>
                  <Input
                    type="text"
                    placeholder="กรอกข้อความที่ต้องการ"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="border-primary/20 focus:border-primary"
                    disabled={!isCustomTextEnabled}
                  />
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>พิมพ์ข้อความด้านล่างรูป หรือส่งรูป/โลโก้มาทางแชท</li>
                    <li>แจ้งสีอักษร ทอง-เงิน-ขาว-ดำ *ไม่แจ้งจะติดสีทองดังรูป*</li>
                    <li>
                      แจ้งตำแหน่งที่ติด (ด้านหน้าชิ้นงานเท่านั้น) *ไม่แจ้งจะติดด้านล่างดังรูป*
                    </li>
                    <li>กรอบวงรีแขวนผนังเพิ่มข้อความไม่ได้</li>
                  </ul>
                  <div className="mt-4">
                    <Image
                      src="https://res.cloudinary.com/ddcjkc1ns/image/upload/v1740125488/text_ru23ht.jpg"
                      alt="Custom text example"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
          <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <Collapsible>
              <CollapsibleTrigger className="flex w-full justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center text-primary">
                  Pattern Design การจัดเรียงดอกไม้
                </h2>
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        ลูกค้าสามารถระบุการจัดเรียงดอกไม้
                        เพื่อทางร้านจะสามารถจัดเรียงตรงตามความต้องการของลูกค้าได้มากที่สุด
                        เพราะหากมีการแก้ไขแบบ จะทำให้ออเดอร์ล่าช้าได้
                      </p>
                      <p className="text-gray-600 italic">
                        ตย.เช่น จัดทรงช่อ, ระบุสีดอกไม้, ระบุดอกไม้, จัดวางแบบกระจาย,
                        จัดวางแบบแน่นชิ้นงาน, จัดวางเน้นตรงกลาง เป็นต้น
                      </p>
                      <p className="text-gray-600">หรือส่งรูปตัวอย่างมาทางแชทไลน์ได้ค่ะ</p>
                    </div>
                  </AlertDescription>
                </Alert>

                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดการจัดเรียงดอกไม้ (ไม่บังคับ)"
                  className="min-h-[128px] resize-none focus:ring-yellow-200"
                />

                <p className="text-gray-500 text-sm">
                  (หากไม่มีข้ามได้ค่ะ ทางร้านจะจัดเรียงให้ตามที่เห็นว่าสวยและเหมาะสมค่ะ^^)
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
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

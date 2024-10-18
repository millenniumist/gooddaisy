"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [colorRefinement, setColorRefinement] = useState(200);
  const [message, setMessage] = useState(0);
  const [addOnItem, setAddOnItem] = useState(0);
  const [allowColorRefinement, setAllowColorRefinement] = useState(true);
  const [allowMessage, setAllowMessage] = useState(true);
  const [allowAddOnItem, setAllowAddOnItem] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const router = useRouter();

  const handleUploadSuccess = (result: any) => {
    setUploadedImages(prev => [...prev, result.info.secure_url]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9\s]+$/.test(name.trim())) {
      alert("Product name cannot be empty and should only contain letters, numbers, and spaces.");
      return;
    }
    try {
      const productData = {
        name,
        price,
        colorRefinement,
        message,
        addOnItem,
        allowColorRefinement,
        allowMessage,
        allowAddOnItem,
        images: uploadedImages
      };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/product`, productData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log("Product added successfully:", response.data);
      router.push("/");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
                <div>
      <Label htmlFor="name">Product Name</Label>
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter product name"
        required
      />
    </div>
    
    <div>
      <Label htmlFor="price">Price</Label>
      <Input
        id="price"
        type="number"
        value={price}
        onChange={(e) => setPrice((e.target.value))}
        placeholder="Enter price"
        required
      />
    </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowColorRefinement"
                    checked={allowColorRefinement}
                    onCheckedChange={setAllowColorRefinement}
                  />
                  <Label htmlFor="allowColorRefinement">Allow Color Refinement</Label>
                </div>
                {allowColorRefinement && (
                  <div className="w-1/2">
                    <Input
                      id="colorRefinement"
                      type="number"
                      value={colorRefinement}
                      onChange={(e) => setColorRefinement(Number(e.target.value))}
                      placeholder="Color Refinement Price"
                    />
                  </div>
                )}
              </div>
  
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowMessage"
                    checked={allowMessage}
                    onCheckedChange={setAllowMessage}
                  />
                  <Label htmlFor="allowMessage">Allow Message</Label>
                </div>
                {allowMessage && (
                  <div className="w-1/2">
                    <Input
                      id="message"
                      type="number"
                      value={message}
                      onChange={(e) => setMessage(Number(e.target.value))}
                      placeholder="Message Price"
                    />
                  </div>
                )}
              </div>
  
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowAddOnItem"
                    checked={allowAddOnItem}
                    onCheckedChange={setAllowAddOnItem}
                  />
                  <Label htmlFor="allowAddOnItem">Allow Add-On Item</Label>
                </div>
                {allowAddOnItem && (
                  <div className="w-1/2">
                    <Input
                      id="addOnItem"
                      type="number"
                      value={addOnItem}
                      onChange={(e) => setAddOnItem(Number(e.target.value))}
                      placeholder="Add-On Item Price"
                    />
                  </div>
                )}
              </div>
            </div>
           
            <div className="space-y-2">
              <Label>Images</Label>
              <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <Button type="button" onClick={() => open()} variant="outline">
                    Upload Images
                  </Button>
                )}
              </CldUploadWidget>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image src={url} alt={`Uploaded ${index + 1}`} width={200} height={200} className="rounded-md" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Add Product
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

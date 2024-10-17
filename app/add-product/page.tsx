"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    colorRefinement: 200,
    message: 0,
    addOnItem: 0,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleUploadSuccess = (result: any) => {
    setUploadedImages(prev => [...prev, result.info.secure_url]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9\s]+$/.test(formData.name.trim())) {
      alert("Product name cannot be empty and should only contain letters, numbers, and spaces.");
      return;
    }
    try {
      const productData = { ...formData, images: uploadedImages };
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
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Label>
                <Input
                  id={key}
                  name={key}
                  type={key === 'name' ? 'text' : 'number'}
                  value={value}
                  onChange={handleInputChange}
                  required
                  pattern={key === 'name' ? "^[a-zA-Z0-9\\s]+$" : undefined}
                  title={key === 'name' ? "Product name should only contain letters, numbers, and spaces" : undefined}
                />
              </div>
            ))}
            <div>
              <Label htmlFor="images">Images</Label>
              <CldUploadWidget uploadPreset="ml_default" onSuccess={handleUploadSuccess}>
                {({ open }) => (
                  <Button type="button" onClick={() => open()}>
                    Upload Images
                  </Button>
                )}
              </CldUploadWidget>
              <div className="mt-2 space-y-2">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Image src={url} alt={`Uploaded ${index + 1}`} width={200} height={100} />
                    <Button type="button" variant="destructive" onClick={() => removeImage(index)}>
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

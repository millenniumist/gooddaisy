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
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    colorRefinement: 200,
    message: 0,
    addOnItem: 0,
    images: [],
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "colorRefinement" || name === "message" || name === "addOnItem"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleUploadSuccess = (result: any) => {
    setUploadedImages((prev) => [...prev, result.info.secure_url]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price as unknown as string);
      formData.append('colorRefinement', product.colorRefinement as unknown as string);
      formData.append('message', product.message as unknown as string);
      formData.append('addOnItem', product.addOnItem as unknown as string);
      uploadedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });
      console.log("Uploaded images before sending:", uploadedImages);
      await axios.post(`${process.env.NEXT_PUBLIC_URL}api/product`, formData)
        .then(response => {
          console.log("Product added successfully:", response.data);
          router.push("/");
        })
        .catch(error => {
          console.error("Error adding product:", error.response?.data || error.message);
        });
    } catch (error) {
      console.error("Error submitting form:", error);
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
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="colorRefinement">Color Refinement Price</Label>
              <Input
                id="colorRefinement"
                name="colorRefinement"
                type="number"
                value={product.colorRefinement}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="message">Message Price</Label>
              <Input
                id="message"
                name="message"
                type="number"
                value={product.message}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="addOnItem">Add-On Item Price</Label>
              <Input
                id="addOnItem"
                name="addOnItem"
                type="number"
                value={product.addOnItem}
                onChange={handleInputChange}
              />
            </div>
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
                    <Button type="button" onClick={() => removeImage(index)}>
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

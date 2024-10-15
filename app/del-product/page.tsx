'use client'

import { useState } from 'react';
import { ToastWrapper } from "@/components/ui/ToastWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function DeleteProductPage({ products, onDeleteProduct }) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (selectedProductId) {
      const formData = new FormData();
      formData.append('productId', selectedProductId);
      await onDeleteProduct(formData);
      setSelectedProductId(null);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Delete Product</CardTitle>
        <CardDescription>Select a product to delete</CardDescription>
      </CardHeader>
      <CardContent>
        <ToastWrapper onSubmit={handleDelete}>
          <Select onValueChange={(value) => setSelectedProductId(value)}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full" disabled={!selectedProductId}>Delete Product</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product and its associated images.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ToastWrapper>
      </CardContent>
    </Card>
  );
}

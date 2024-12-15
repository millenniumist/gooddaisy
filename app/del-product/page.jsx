'use client'

import { useEffect, useState } from "react";
import { ToastWrapper } from "@/components/ui/ToastWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/router";

export default function DeleteProductPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAdmin = useMainStorage(state => state.isAdmin)
  const router = useRouter()

  useEffect(() => {
    if(!isAdmin) {
      router.push('/login/admin')
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (formData) => {
    const productId = formData.get('productId');
    if (!productId) return { error: 'Product ID is required' };

    const product = products.find(p => p.id.toString() === productId.toString());
    if (product) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
    }
    
    return null;
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/product/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      setIsDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
      return { success: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { error: 'Failed to delete product' };
    }
  };

  return (
    <>
      <Card className="w-[350px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>Delete Product</CardTitle>
          <CardDescription>Select a product to delete</CardDescription>
        </CardHeader>
        <CardContent>
          <ToastWrapper onSubmit={handleDelete}>
            <Select name="productId">
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
            <Button type="submit" className="w-full">Delete Product</Button>
          </ToastWrapper>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

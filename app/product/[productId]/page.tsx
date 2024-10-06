  "use client"
  
  import Image from 'next/image'
  import { useState } from 'react'
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Switch } from "@/components/ui/switch"
import Product from '@/app/page-components/Product'
//mock data
const products = [
  {
    id: 1,
    name: "Heart Shape Mold",
    price: 29.99,
    images: ["/images/heart-mold-1.jpg", "/images/heart-mold-2.jpg", "/images/heart-mold-3.jpg"],
  },
  {
    id: 2,
    name: "Round Shape Mold",
    price: 24.99,
    images: ["/images/round-mold-1.jpg", "/images/round-mold-2.jpg", "/images/round-mold-3.jpg"],
  },
  {
    id: 3,
    name: "Square Shape Mold",
    price: 27.99,
    images: ["/images/square-mold-1.jpg", "/images/square-mold-2.jpg", "/images/square-mold-3.jpg"],
  },
];

  export default function ProductCustomization({ params }: { params: { productId: string } }) {
    const [colorRefinement, setColorRefinement] = useState(false)
    const [attachedItem, setAttachedItem] = useState(false)
    const [customText, setCustomText] = useState('')

    const handleColorRefinementChange = (checked: boolean) => setColorRefinement(checked)
    const handleItemAttach = (checked: boolean) => setAttachedItem(checked)
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => setCustomText(e.target.value)

  



    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Customize Your Product</h1>
        <Product id={Number(params.productId)} name={products[0].name} price={products[0].price} images={products[0].images} />
        <Card>
          <CardHeader>
            <CardTitle>Product Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">1. Color Refinement</h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="color-refinement"
                  checked={colorRefinement}
                  onCheckedChange={handleColorRefinementChange}
                />
                <Label htmlFor="color-refinement">Enable Color Refinement</Label>
              </div>
            </div>
          
            <div>
              <h2 className="text-xl font-semibold mb-2">2. Attach Item</h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="attach-item"
                  checked={attachedItem}
                  onCheckedChange={handleItemAttach}
                />
                <Label htmlFor="attach-item">Attach Item</Label>
              </div>
            </div>
          
            <div>
              <h2 className="text-xl font-semibold mb-2">3. Custom Text</h2>
              <Input
                type="text"
                placeholder="Enter your custom text"
                value={customText}
                onChange={handleTextChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Customization</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

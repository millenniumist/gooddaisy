import React from "react";
import { Product } from "../models/product";

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  return (
    <div className="p-2" >
    <div className="bg-white rounded-lg shadow-md ">
      <img src={product.images[0]} alt={product.name} className="h-40 bg-gray-300 mb-1 rounded" />
      <div className="text-center pb-3">
        <div className="font-medium mx-1 whitespace-pre overflow-clip">{product.name}</div>
        <div className="text-sm font-light">From {product.price} THB</div>
      </div>
    </div>
  </div>
  );
};

export default ProductCard;

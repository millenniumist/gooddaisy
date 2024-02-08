import React from "react";

interface ProductCardProps {
  productImage: string;
  productName: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productImage,
  productName = "Square",
  price = "2500",
}) => {
  return (
    <div className="p-2">
    <div className="bg-white rounded-lg shadow-md">
      <img src={productImage} alt={productName} className="h-40 bg-gray-300 mb-1 rounded" />
      <div className="text-center pb-3">
        <div className="font-medium ">{productName}</div>
        <div className="text-sm font-light">From {price} THB</div>
      </div>
    </div>
  </div>
  );
};

export default ProductCard;

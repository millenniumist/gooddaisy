import React from "react";

const ProductCard: React.FC = () => {
    return (
      <div className="p-1">
        <div className="bg-white rounded-lg shadow-md">
          <div className="h-40 bg-gray-300 mb-1 rounded"></div>{" "}
          {/* Image placeholder */}
          <div className="text-center pb-3">
            <div className="font-medium ">Hexagon Coaster</div>
            <div className="text-sm font-light">From 2,500 THB</div>
          </div>
        </div>
      </div>
    );
  };

  export default ProductCard;
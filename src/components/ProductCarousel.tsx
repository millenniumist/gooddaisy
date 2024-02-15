import React from "react";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Slider, { Settings } from "react-slick";
import { Product } from "../models/product";

interface ProductCarouselProps {
  type: string;
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  type,
  products,
}) => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    adaptiveHeight: true,
  };

  return (
    <div>
       <h1 className="title">{type}</h1>
      <div className="px-2 py-2">
        <Slider {...settings}>
          {products.map((product)=>{
            return (
              <ProductCard product={product} key={product.id}/>
            )
          })

          }
          {/* Add as many ProductCard components as needed */}
        </Slider>
      </div>
    </div>
  );
};

export default ProductCarousel;

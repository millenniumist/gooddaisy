import React from "react";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Slider, { Settings } from "react-slick";

const ProductCarousel: React.FC = () => {
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
      <div className="px-4 py-2">
        <Slider {...settings}>
          <ProductCard />
          <ProductCard />
          {/* Add as many ProductCard components as needed */}
        </Slider>
      </div>
    );
  };

  export default ProductCarousel;
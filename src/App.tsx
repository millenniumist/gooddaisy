import React from "react";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";

function App() {

  return (
    <div>
      <head className="bg-primary px-2  h-7 flex items-center text-white font-light text-sm">

        {" "}
        {/* Header */}
        News outside working hours
      </head>
      <div>
        <div className="title">Custom Preservation</div> {/* Products */}
        <ProductCarousel />
      </div>
      <div className="flex bg-gray-300 h-2 my-5"/>
      <div>
        <div className="title">On Shelf Product</div>

        {/* More products */}
        <ProductCarousel />
      </div>
     

    
      Footer navigation
      <div className="fixed inset-x-0 bottom-0 bg-white ">
        <ul className="flex justify-around  h-11 my-2 boxShadow">
          <li>
            <button type="button" className= "bottom-nav"> 
              <i className="fa-solid fa-user fa-xl text-primary "></i>
              <div className="text-sm text-primary">Member</div> 
            </button>            
          </li>
          <li>            
            <button type="button" className= "bottom-nav"> 
              <i className="fa-solid fa-hand fa-xl text-primary "></i>
              <div className="text-sm text-primary">Activity</div> 
            </button>  

          </li>
          <li>Home</li>
          <li>Tracking</li>
          <li>Cart</li>
        </ul>
      </div>
    </div>
  );
}

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

export default App;

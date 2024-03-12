import ProductCarousel from "../components/ProductCarousel";
import BaseScreen from "../components/BaseScreen";
import { useEffect, useState } from "react";
import PRODUCTS from "../../mock/GetProductList.json";
import ProductType from "../constants/productCat";

const Home = () => {
  const [productAlphabets, setProductAlphabets] = useState([]);
  const [productShapes, setProductShapes] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("../../mock/GetProductList.json");
        const products = await response.json();
        const dataAlphabets = products.data.filter((product) => {
          return product.type === ProductType.Alphabet;
        });
        const dataShapes = products.data.filter((product) => {
          return product.type === ProductType.Shape;
        });
        setProductAlphabets(dataAlphabets);
        setProductShapes(dataShapes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <BaseScreen>
      <header className="bg-primary px-2  h-7 flex items-center text-white font-light text-sm">
        {" "}
        News outside working
      </header>
      {/* Custom Preservation */}
      <ProductCarousel products={productShapes} type={ProductType.Shape} />
      <hr className="flex bg-gray-300 h-2 my-5" /> {/*break*/}
      {/* On-shelf Product */}
      <ProductCarousel
        products={productAlphabets}
        type={ProductType.Alphabet}
      />
      {/* Footer navigation */}

    </BaseScreen>
  );
};

export default Home;

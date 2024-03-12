import { useEffect, useState } from "react";
import ProductGallery from "../components/ProductGallery";
import { useParams } from "react-router-dom";
import { Product } from "../models/product";
import PrimaryButton from "../components/PrimaryButton";
import BaseScreen from "../components/BaseScreen";
import SecondaryButton from "../components/SecondaryButton";
import CustomListComponent from "../components/BaseCheckBox";

const ProductDetail = () => {
  const [product, setProduct] = useState<Product>();
  const { id } = useParams<{ id?: string }>(); // useParams hook to get the `id` from the route

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("../../mock/GetProductList.json");
        const products = await response.json();
        const selectedProduct = products.data.find(
          (product: Product) => product.id === parseInt(id ?? "0")
        );
        setProduct(selectedProduct);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [id]); // Dependency array includes id, so it refetches data when id changes
  return (
    <BaseScreen>
      <header className="bg-primary px-2  h-7 flex  text-white font-light text-sm">
        Product details
      </header>
      {/* content */}
      <section>
        <div>
          <h2 className="ml-5 my-3 font-bold">{product?.name}</h2>
          <p className="ml-3 text-sm">{product?.description}</p>
          <ProductGallery images={product?.images} />
        </div>
      </section>
      {/* form input */}
      {/* <form className="flex flex-col items-center w-full " > */}

      <CustomListComponent />

      <PrimaryButton
        title={"Check Out"}
        onClick={function (): void {
          console.log("Clicked");
        }}
        value={"(1,000 THB)"}
      />
      <SecondaryButton
        title={"Add to Cart"}
        onClick={function (): void {
          console.log("Clicked");
        }}
      />
      {/* </form> */}
    </BaseScreen>
  );
};

export default ProductDetail;

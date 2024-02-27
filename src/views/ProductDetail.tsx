import ProductGallery from "../components/ProductGallery";




const ProductDetail = () => {

  return (
    <div>
      <header className="bg-primary px-2  h-7 flex items-center text-white font-light text-sm">
        Product details
      </header>
      <div>
        <h2 className="ml-5 my-3 font-bold">Heart Shaped resin</h2>
        <p className="ml-3 text-sm">
          Specially created for you and your loved one, coaster size 5” could
          fit in 2 roses{" "}
        </p>
        <ProductGallery/>
        


      </div>
    </div>
  );
};

export default ProductDetail;

import ProductCarousel from "../components/ProductCarousel";
import FooterNav from "../components/FooterNav";

const Home = () => {
  return (
    <div>
      <header className="bg-primary px-2  h-7 flex items-center text-white font-light text-sm">
        {" "}
        News outside working
      </header>
      {/* Custom Preservation */}
      <div>
        <div className="title">Shape</div>
        <ProductCarousel />
      </div>
      <hr className="flex bg-gray-300 h-2 my-5" /> {/*break*/}
      <div>
        <div className="title">Alphabet</div>

        {/* On-shelf Product */}
        <ProductCarousel />
      </div>
      {/* Footer navigation */}
      <FooterNav />
    </div>
  );
};

export default Home;

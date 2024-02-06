import "./App.css";
import ProductCarousel from "./components/ProductCarousel";
import FooterNav from "./components/FooterNav"
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* Header */}
      <header className="bg-primary px-2  h-7 flex items-center text-white font-light text-sm">
        {" "}
        News outside working
      </header>
      {/* Custom Preservation */}
      <div>
        <div className="title">Custom Preservation</div> 
        <ProductCarousel />
      </div>
      <div className="flex bg-gray-300 h-2 my-5" /> {/*break*/}
      <div>
        <div className="title">On Shelf Product</div>

        {/* On-shelf Product */}
        <ProductCarousel />
      </div>
      {/* Footer navigation */}
      Footer navigation
      <FooterNav />
    </Router>
  );
}

export default App;

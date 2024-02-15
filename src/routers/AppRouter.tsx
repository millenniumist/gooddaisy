// Import necessary modules
import React from "react";
import { createBrowserHistory, History } from "history";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import ProductDetail from "../views/ProductDetail";
import * as ROUTES from '../constants/routes';
import FooterNav from "../components/FooterNav";


// Create browser history
const history: History = createBrowserHistory();

// Define router component
const AppRouter: React.FC = () => (
  <Router history={history}>
    <FooterNav />
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.VIEW_PRODUCT} element={<ProductDetail />} />
    </Routes>
  </Router>
);

export default AppRouter;

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import HotDeals from "./pages/HotDeals";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import ProductDetail from "./component/ProductDetail"
import Category from "./component/Category"
import SearchResult from './component/SearchResult';
import AffiliateDisclosures from './pages/AffiliateDisclosures'

export default function App() {
  return (
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="hot-deals" element={<HotDeals />} />
      <Route path="affiliate-disclosures" element={<AffiliateDisclosures />} />
      <Route path="about-us" element={<About />} />
      <Route path="contact-us" element={<Contact />} />
      <Route path="/search/:searchTerm" element={<SearchResult />} />
      <Route path=":slug" element={<ProductDetail />} />
      <Route path=":category/:slug" element={<Category />} />
      <Route path="*" element={<NoPage />} />
    </Route>
  </Routes>
</BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
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
import AffiliateDisclosures from './pages/AffiliateDisclosures';
import Under99 from './pages/Under99';
import Under199 from './pages/Under199';
import Under299 from './pages/Under299';


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
    <Route path="under-99" element={<Under99 />} />
    <Route path="under-199" element={<Under199 />} />
    <Route path="under-299" element={<Under299 />} />
    <Route path="/search/:searchTerm" element={<SearchResult />} />
    <Route path=":category/:slug" element={<Category />} /> {/* Specific category route */}
    <Route path=":slug" element={<ProductDetail />} /> {/* Product detail route */}
    <Route path="*" element={<NoPage />} /> {/* Catch-all route */}
  </Route>
</Routes>

</BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
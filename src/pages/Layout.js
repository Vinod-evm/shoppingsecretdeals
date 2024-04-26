import { Outlet, Link } from "react-router-dom";
import logo from "../images/Shopping-secret-deals-logo.png"
import '../css/home.css';
import Footer from "../pages/Footer"
import SearchForm from "../component/SearchForm" 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

const Layout = () => {
  return (
    <div className="wrapper">
      <div className="top_header"><a href="/"> <FontAwesomeIcon icon={faFire} /> Shop Now at Lowest Price</a></div>
    <div className="container-fluid">
      <div className="header row">
        {/* Left Column for Logo */}
        <div className="col-sm-3">
          <div className="logo">
            <Link to="/">
            <img src={ logo } alt="Logo" />
            </Link>
          </div>
        </div>

        {/* Middle Column for Menu */}
        <div className="col-sm-6">
          <nav>
            <ul className="nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/hot-deals" className="nav-link">Hot Deals</Link>
              </li>
              <li className="nav-item">
                <Link to="/affiliate-disclosures" className="nav-link">Affiliate Disclosures</Link>
              </li>
              <li className="nav-item">
                <Link to="/about-us" className="nav-link">About us</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact-us" className="nav-link">Contact us</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Right Column for Search Bar */}
        <div className="col-sm-3">
     <SearchForm/>
          </div>
      </div>
      </div>
      {/* Outlet for rendering nested routes */}
      <div className="row">
        <div className="col">
          <Outlet />
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default Layout;

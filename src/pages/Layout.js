import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../images/Shopping-secret-deals-logo.png";
import logomobile from "../images/mobile_log.png";
import '../css/home.css';
import Footer from "../pages/Footer";
import SearchForm from "../component/SearchForm"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faSearch, faBars, faTimes  } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("/");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    // Update active link when the location changes
    setActiveLink(location.pathname);
  }, [location]);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen); // Toggle navbar visibility
  };
  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen); // Toggle mobile search visibility
  };
  return (
    <div className="wrapper">
      <div className="top_header">
        <a href="/"> 
          <FontAwesomeIcon icon={faFire} /> Shop Now at Lowest Price
        </a>
      </div>
      <div className="header">
     
        <div className="header mobile">
                {/* Mobile Search Form */}
      <div className={`mobile_search ${mobileSearchOpen ? "open" : ""}`}>
          <SearchForm />
          <button className="close_search" onClick={toggleMobileSearch}>
            <FontAwesomeIcon icon={faTimes} /> {/* Close button */}
          </button>
        </div>
          <div className="head_item">
            <nav className="navbar-expand-lg">
            <button className="toggler" type="button" onClick={toggleNavbar}>
                <FontAwesomeIcon icon={navbarOpen ? faTimes : faBars} /> {/* Change icon based on navbar state */}
              </button>
              <div className={`menu_list ${navbarOpen ? "show" : ""}`} id="navbarNav"> {/* Show or hide based on state */}
              <ul className="nav" id='menuitem'>
                <li className="nav-item">
                  <Link 
                    to="/" 
                    className={`nav-link ${activeLink === "/" ? "active" : ""}`}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/hot-deals" 
                    className={`nav-link ${activeLink === "/hot-deals" ? "active" : ""}`}
                  >
                    Hot Deals
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/affiliate-disclosures" 
                    className={`nav-link ${activeLink === "/affiliate-disclosures" ? "active" : ""}`}
                  >
                    Affiliate Disclosures
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/about-us" 
                    className={`nav-link ${activeLink === "/about-us" ? "active" : ""}`}
                  >
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/contact-us" 
                    className={`nav-link ${activeLink === "/contact-us" ? "active" : ""}`}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
              </div>
            </nav>
          </div>

          {/* Left Column for Logo */}
          <div className="head_item">
            <div className="logo">
              <Link to="/">
                <img src={logomobile} alt="Logo" />
              </Link>
            </div>
          </div>

         

          {/* Right Column for Search Bar */}
          <div className="head_item search_btn">
          <FontAwesomeIcon icon={faSearch} onClick={toggleMobileSearch} />
          </div>
        </div>
<div className="container-fluid">
        <div className="header desktop row">
          {/* Left Column for Logo */}
          <div className="col-sm-3">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Logo" />
              </Link>
            </div>
          </div>

          {/* Middle Column for Menu */}
          <div className="col-sm-6">
            <nav>
              <ul className="nav" id='menuitem'>
                <li className="nav-item">
                  <Link 
                    to="/" 
                    className={`nav-link ${activeLink === "/" ? "active" : ""}`}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/hot-deals" 
                    className={`nav-link ${activeLink === "/hot-deals" ? "active" : ""}`}
                  >
                    Hot Deals
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/affiliate-disclosures" 
                    className={`nav-link ${activeLink === "/affiliate-disclosures" ? "active" : ""}`}
                  >
                    Affiliate Disclosures
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/about-us" 
                    className={`nav-link ${activeLink === "/about-us" ? "active" : ""}`}
                  >
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/contact-us" 
                    className={`nav-link ${activeLink === "/contact-us" ? "active" : ""}`}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right Column for Search Bar */}
          <div className="col-sm-3">
            <SearchForm />
          </div>
        </div>
        </div>
      </div>

      {/* Outlet for rendering nested routes */}
      <div className="row">
        <div className="col">
          <Outlet />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;

import React, { Component } from 'react';
import footerLogo  from "../images/Footer-logo-300x279.png";
import fb from "../images/fb.png"
import SearchForm from "../component/SearchForm" 

class Footer extends Component {
  render() {
    return (
        <footer>
        <div className="container-fluid">
      <div className="footer-columns">
        <div className="footer-column">
          <div className='footer_logo'>
            <img src={ footerLogo } alt="Logo" />
          </div>
          <div className='footer_social'>
            <img src={ fb } alt="Facebook" />
            <img src={ fb } alt="Twitter" />
            <img src={ fb } alt="Instagram" />
          </div>
        </div>
        <div className="footer-column footer_link">
          <h3>Links</h3>
          {/* Links */}
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/hot-deals">Hot Deals</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <SearchForm/>
        </div>
      </div>
      <div className="bottom-footer">
        {/* Content for bottom footer */}
      </div>
    </div>
    </footer>
    );
  }
}

export default Footer;
import React, { Component } from 'react';
import footerLogo  from "../images/Footer-logo-300x279.png";
import fb from "../images/fb.png"
import insta from "../images/insta.png"
import twitter from "../images/twitter.png"
import telegram from "../images/telegram.png"

import SearchForm from "../component/SearchForm" 
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
        <footer>
        <div className="container-fluid">
      <div className="footer-columns">
        <div className="footer-column">
          <div className='footer_logo'>
            <Link to={`/`}><img src={ footerLogo } alt="Logo" /></Link>
          </div>
          <div className='footer_social'>
            <h3>Follow Us</h3>
            <a target='_blank' href='https://www.facebook.com/ShoppingSecretDeals'><img src={ fb } alt="Facebook" /></a>
            <a target='_blank' href='https://twitter.com/s_s_deals'><img src={ twitter } alt="Twitter" /></a>
            <a target='_blank' href='https://www.instagram.com/shopping_secret_dealss/'><img src={ insta } alt="Instagram" /></a>
            <a target='_blank' href='https://t.me/Shopping_Secret_Deals'><img src={ telegram } alt="telegram" /></a>
          </div>
        </div>
        <div className="footer-column footer_link">
          <h3>Links</h3>
          {/* Links */}
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/hot-deals">Hot Deals</a></li>
            <li><a href="/about-us">About</a></li>
            <li><a href="/contact-us">Contact</a></li>
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
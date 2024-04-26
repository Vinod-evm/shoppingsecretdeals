import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import HotDealBanner from '../images/hotdeal-banner.webp'

const HotDeals = () => {
  const [hotDeals, setHotdeals] = useState([]);

  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/posts?per_page=50')
      .then(response => response.json())
      .then(data => {
        setHotdeals(data);
      })
      .catch(error => console.error('Error fetching banners:', error));
  }, []);


  const extractNumericalValue = (priceString) => {
    // Extract numerical value from the string
    return parseFloat(priceString.replace(/[^\d.-]/g, ''));
  };

  const calculateDiscountPercentage = (mainPrice, discountPrice) => {
    const discountAmount = mainPrice - discountPrice;
    const discountPercentage = (discountAmount / mainPrice) * 100;
    return Math.round(discountPercentage); // Round the discount percentage to the nearest whole number
  };

  return (
    <div className='Hot-deals-page'>
      <div className='hot_deal_banner'>
        <img alt="hot deal" src={HotDealBanner}/>
      </div>
       <div className="container-fluid">
        <div className='hot-deal_container'>
          <div className='trend_grid row'>
            {hotDeals.map(pro => (
              <div key={pro.id} className="col-sm-3">
                <div className='trend-item'>
                  {/* Access the first image URL from the og_image array */}
                  <Link to={`/${pro.slug}`}><img src={pro.jetpack_featured_media_url} alt={pro.name} /></Link>
                    <span className='trend_offer_price'>{pro.meta.rehub_offer_product_price}</span>
                    <span className='trend_old_price'><del>{pro.meta.rehub_offer_product_price_old}</del></span>
                    <Link to={`/${pro.slug}`}><h2 className='product_ttl'>{pro.title.rendered}</h2></Link>
                    <span className='discount_percentage'>
                      {calculateDiscountPercentage(
                        extractNumericalValue(pro.meta.rehub_offer_product_price_old),
                        extractNumericalValue(pro.meta.rehub_offer_product_price)
                      )}%
                    </span>
                  
                  <a className="buy_btn" href={pro.meta.rehub_offer_product_url}>
                    Buy it now
                  </a>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
    </div>
  );
};

export default HotDeals;

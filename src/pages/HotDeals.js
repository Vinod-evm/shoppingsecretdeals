import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import HotDealBanner from '../images/hotdeal-banner.webp';
import '../css/Hotdeals.css'; // CSS for skeleton loader
// Skeleton Component for loading

const HotDeals = () => {
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(1); // Current page number
  const perPage = 50; // Number of posts per page
  const [apiCallsCount, setApiCallsCount] = useState(0);
  console.log(apiCallsCount, 'apiCallsCount');
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Function to calculate discount percentage
  const calculateDiscountPercentage = (mainPrice, discountPrice) => {
    const discountAmount = mainPrice - discountPrice;
    const discountPercentage = (discountAmount / mainPrice) * 100;
    return Math.round(discountPercentage); // Round the discount percentage to the nearest whole number
  };

  // Function to extract numerical value from a price string
  const extractNumericalValue = (priceString) => {
    // Extract numerical value from the string
    return parseFloat(priceString.replace(/[^\d.-]/g, ''));
  };

  useEffect(() => {
    if (apiCallsCount < 10) {
    fetchData(); // Fetch data when component mounts
    window.addEventListener('scroll', handleScroll); // Add scroll event listener
    return () => {
      window.removeEventListener('scroll', handleScroll); // Remove scroll event listener on component unmount
    };}
  }, [apiCallsCount]); // Only run once on component mount

  // Function to fetch data from the API
  const fetchData = () => {
    setLoading(true); // Set loading state to true
    fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}`)
      .then(response => response.json())
      .then(data => {
        setHotDeals(prevHotDeals => [...prevHotDeals, ...data]); // Append new data to existing hotDeals array
        setPage(prevPage => prevPage + 1); // Increment page number for the next fetch
        setLoading(false); // Set loading state to false
        setApiCallsCount(prevCount => prevCount + 1);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading state to false if there's an error
      });
  };

  // Function to handle scroll event
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // When the user reaches the bottom of the page, fetch more data
      fetchData();
    }
  };

  // JSX remains unchanged

  return (
    <div className='Hot-deals-page'>
      <div className='hot_deal_banner'>
        <img alt="hot deal" src={HotDealBanner}/>
      </div>
      <div className="container-fluid">
        <div className='hot-deal_container'>
        <div className='trend_grid row'>
        {hotDeals.filter(pro => {
  const discountPercentage = calculateDiscountPercentage(
    extractNumericalValue(pro.meta.rehub_offer_product_price_old),
    extractNumericalValue(pro.meta.rehub_offer_product_price)
  );
  return discountPercentage >= 70; // Filter deals with discount percentage >= 70
}).map((pro, index) => (
  <div key={index} className="col-sm-3">
    <div className='trend-item'>
      {/* Access the first image URL from the og_image array */}
      <Link to={`/${pro.slug}`}><img src={pro.jetpack_featured_media_url} alt={pro.title.rendered} /></Link>
      <span className='trend_offer_price'>{pro.meta.rehub_offer_product_price}</span>
      <span className='trend_old_price'><del>{pro.meta.rehub_offer_product_price_old}</del></span>
      <Link to={`/${pro.slug}`}><h2 className='product_ttl'>{pro.title.rendered}</h2></Link>
      <span className='discount_percentage'>
        {calculateDiscountPercentage(
          extractNumericalValue(pro.meta.rehub_offer_product_price_old),
          extractNumericalValue(pro.meta.rehub_offer_product_price)
        )}%
      </span>
      <a target="_blank" className="buy_btn" href={pro.meta.rehub_offer_product_url}>
        Buy it now
      </a>
    </div>
  </div>
))}

</div>
<div className="skeleton-container_hot">
    {loading && Array.from({ length: 4 }).map((_, index) => (  
    <div className="skeleton-item">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-price"></div>
      <div className="skeleton-button"></div>
    </div>))} 
  </div>
    </div>
  
    </div>
    </div>
  );
};

export default HotDeals;

// SearchResult.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategorySidebar from '../component/CategorySidebar';

const SearchResult = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  console.log(searchResults,"searchResults");

  useEffect(() => {
    fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/posts?search=${searchTerm}&_embed`)
      .then(response => response.json())
      .then(data => setSearchResults(data))
      .catch(error => console.error('Error fetching search results:', error));
  }, [searchTerm]);

  const renderProductDetails = () => {
    return (
      <div className='category-page'>
        <div className='trend_grid row'>
          {searchResults.map(pro => (
            <div key={pro.id} className="col-sm-3">
              <div className='trend-item'>
                <Link to={`/${pro.slug}`}>
                  <img src={pro.jetpack_featured_media_url} alt={pro.name} /></Link>
                  <span className='cat_p_offer_price'>{pro.meta.rehub_offer_product_price}</span>
                  <span className='cat_p_old_price'><del>{pro.meta.rehub_offer_product_price_old}</del></span>
                  <Link to={`/${pro.slug}`}> <h2 className='product_ttl'>{pro.title.rendered}</h2></Link>
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
    );
  };
   // Function to calculate discount percentage
   const calculateDiscountPercentage = (mainPrice, discountPrice) => {
    const discountAmount = mainPrice - discountPrice;
    const discountPercentage = (discountAmount / mainPrice) * 100;
    return Math.round(discountPercentage);
  };

  // Function to extract numerical value from a string
  const extractNumericalValue = (priceString) => {
    return parseFloat(priceString.replace(/[^\d.-]/g, ''));
  };

  return (
    // <div>
    //   <h2>Search Results for: {searchTerm}</h2>
    //   <ul>
    //     {searchResults.map(result => (
    //       <li key={result.id}>{result.title}</li>
    //     ))}
    //   </ul>
    // </div>
    <div className="container-fluid">
    <div className="row">
      {/* Left Sidebar - Category List */}
      <div className="col-md-3">
        <CategorySidebar/>
      </div>
      {/* Right Sidebar - Current Category and Products */}
      <div className="col-md-9">
        <div className='category_right'>
        {/* Current Category Name */}
        {/* {category && <h1>{category.name}</h1>} */}
        {/* Trending Products */}
        {renderProductDetails()}
        </div>
      </div>
    </div>
  </div>
  );
};

export default SearchResult;

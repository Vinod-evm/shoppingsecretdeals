import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategorySidebar from '../component/CategorySidebar';
import '../css/categorySidebar.css';

const SearchResult = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    setLoading(true); // Set loading to true when starting the fetch

    // Check if cached results exist
    const cachedResults = localStorage.getItem(`searchResults_${searchTerm}`);
    if (cachedResults) {
      setSearchResults(JSON.parse(cachedResults));
      setLoading(false); // Set loading to false if cached data is found
    } else {
      // Fetch data from API if no cache
      fetch(`${baseUrl}/wp-json/wp/v2/posts?search=${searchTerm}&_embed`)
        .then(response => response.json())
        .then(data => {
          setSearchResults(data);
          localStorage.setItem(`searchResults_${searchTerm}`, JSON.stringify(data)); // Store results in local storage
          setLoading(false); // Set loading to false once the data is fetched
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setLoading(false); // Set loading to false even if there's an error
        });
    }
  }, [searchTerm]);

  const renderProductDetails = () => {
    if (loading) {
      return (
        <div className="search_loading-skeleton">
          {/* Skeleton Loader */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="search_skeleton-item">
              <div className="search_skeleton-image"></div>
              <div className="search_skeleton-text"></div>
              <div className="search_skeleton-price"></div>
            </div>
          ))}
        </div>
      ); // Show a skeleton loader
    }

    if (searchResults.length === 0) {
      return <div>No results found for "{searchTerm}".</div>; // Show a message if no results are found
    }

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
                
                <a target="_blank" className="buy_btn" href={pro.meta.rehub_offer_product_url}>
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
    <div className="container-fluid">
      <div className="row">
        {/* Left Sidebar - Category List */}
        <div className="col-md-3">
          <CategorySidebar />
        </div>
        {/* Right Sidebar - Current Category and Products */}
        <div className="col-md-9">
          <div className='category_right'>
            {renderProductDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

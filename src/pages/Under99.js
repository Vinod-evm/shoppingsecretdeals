import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Under99 = () => {
  const [under99, setUnder99] = useState([]);
  const [sortBy, setSortBy] = useState('low_to_high');
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [loading, setLoading] = useState(true);
  const [totalProductsLoaded, setTotalProductsLoaded] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(26);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const productsPerPage = 50; // Number of products per page

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    let page = 1;
    let productsUnder99 = [];

    // Fetch products until we have at least 24
    while (productsUnder99.length < 12) {
      try {
        const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=${productsPerPage}&page=${page}`);
        const data = await response.json();

        // Filter products under 99
        const filteredData = data.filter((product) => {
          const price = extractPrice(product.meta.rehub_offer_product_price);
          return price < 99;
        });

        productsUnder99 = [...productsUnder99, ...filteredData];

        // Break if no more products are available
        if (data.length < productsPerPage) {
          setTotalProductsLoaded(true);
          break;
        }

        page++;
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        break;
      }
    }

    setAllProducts(productsUnder99);
    setUnder99(productsUnder99.slice(0, visibleProducts));
    setLoading(false);
  };

  const extractPrice = (priceString) => {
    const regex = /(?:₹|Rs?\.\s*)\s*(\d{1,}(?:,\d{3})*(?:\.\d+)?)/;
    const match = priceString.match(regex);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  };

  const sortProducts = (products, order) => {
    return [...products].sort((a, b) => {
      const priceA = extractPrice(a.meta.rehub_offer_product_price);
      const priceB = extractPrice(b.meta.rehub_offer_product_price);
      return order === 'low_to_high' ? priceA - priceB : priceB - priceA;
    });
  };

  const handleSortChange = (order) => {
    const sortedData = sortProducts(under99, order);
    setUnder99(sortedData);
    setSortBy(order);
  };

  const loadMore = async () => {
    if (totalProductsLoaded) return; // Stop if all products are already loaded
  
    const nextVisibleProducts = visibleProducts + 12; // Increment visible products
    setVisibleProducts(nextVisibleProducts);
  
    let nextProducts = [];
    let currentBatchPage = currentPage; // Start fetching from the current page
  
    // Loop to fetch 25 pages (e.g., 26 to 50)
    while (nextProducts.length < 12 && currentBatchPage < currentPage + 25) {
      try {
        const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=${productsPerPage}&page=${currentBatchPage}`);
        const data = await response.json();
  
        // Filter products under 99
        const filteredData = data.filter((product) => {
          const price = extractPrice(product.meta.rehub_offer_product_price);
          return price < 99;
        });
  
        nextProducts = [...nextProducts, ...filteredData];
  
        if (data.length < productsPerPage) {
          setTotalProductsLoaded(true); // No more products to fetch
          break;
        }
  
        currentBatchPage++; // Increment the page by 1 after each fetch
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        break;
      }
    }
  
    // Update the state with the newly fetched products
    setAllProducts((prevProducts) => [...prevProducts, ...nextProducts]);
    setUnder99((prevUnder99) => [...prevUnder99, ...nextProducts]);
  
    // Increment the current page by 25 to mark the next batch (e.g., 51 to 75 for the next click)
    setCurrentPage(currentBatchPage);
  };
  
  

  const calculateDiscountPercentage = (mainPrice, discountPrice) => {
    const discountAmount = mainPrice - discountPrice;
    return mainPrice !== 0 ? Math.round((discountAmount / mainPrice) * 100) : NaN;
  };

  return (
    <div className="under-pages">
      <div className="container-fluid">
        <div className="under_container">
          <div className="top_vertical_filter">
            <h3 className="sort_by_price">Sort by Price</h3>
            <button onClick={() => handleSortChange('low_to_high')} className={sortBy === 'low_to_high' ? 'active' : ''}>
              Low to High
            </button>
            <button onClick={() => handleSortChange('high_to_low')} className={sortBy === 'high_to_low' ? 'active' : ''}>
              High to Low
            </button>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <>
              {under99.length === 0 ? (
                <h4 className='no_products'>No products found.</h4>
              ) : (
                <div className="trend_grid row">
                  {under99.map((pro) => (
                    <div key={pro.id} className="col-sm-3">
                      <div className="trend-item">
                        <Link to={`/${pro.slug}`}>
                          <img src={pro.jetpack_featured_media_url} alt={pro.title.rendered} />
                        </Link>
                        <span className="trend_offer_price">{pro.meta.rehub_offer_product_price}</span>
                        <span className="trend_old_price">
                          <del>{pro.meta.rehub_offer_product_price_old}</del>
                        </span>
                        <Link to={`/${pro.slug}`}>
                          <h2 className="product_ttl">{pro.title.rendered}</h2>
                        </Link>
                        <span className='discount_percentage'>
                          {calculateDiscountPercentage(
                            extractPrice(pro.meta.rehub_offer_product_price_old),
                            extractPrice(pro.meta.rehub_offer_product_price)
                          )}% 
                        </span>
                        <a target="_blank" className="buy_btn" href={pro.meta.rehub_offer_product_url}>
                          Buy it now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {visibleProducts < allProducts.length && !totalProductsLoaded && (
                <button className="loadmore" onClick={loadMore}>Load More</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Under99;

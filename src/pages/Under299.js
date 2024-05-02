import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Under299 = () => {
  const [under99, setUnder99] = useState([]);
  const [sortBy, setSortBy] = useState('low_to_high'); // Default sort order
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [visiblePages, setVisiblePages] = useState([]); // Visible page numbers
  const [loading, setLoading] = useState(true); // Loading state
  const perPage = 50; // Number of posts per page
  const maxVisiblePages = 5; // Maximum number of visible page numbers
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // Fetch posts whenever currentPage changes

  useEffect(() => {
    generateVisiblePages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, currentPage]); // Update visible pages whenever totalPages or currentPage changes

  const fetchPosts = () => {
    setLoading(true); // Set loading state to true while fetching
    fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=${perPage}&page=${currentPage}`)
      .then((response) => {
        const totalPagesHeader = response.headers.get('X-WP-TotalPages');
        setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
        return response.json();
      })
      .then((data) => {
        // Filter the data to include only products with a price less than 99
        const filteredData = data.filter((product) => {
          const priceString = product.meta.rehub_offer_product_price;
          const price = extractPrice(priceString);
          return price < 99;
        });
  
        const sortedData = sortProducts(filteredData, sortBy);
        setUnder99(sortedData);
        setLoading(false); // Set loading state to false after fetching
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
        setLoading(false); // Set loading state to false if there's an error
      });
  };

  const extractPrice = (priceString) => {
    // Regular expression to extract numerical value from the price string
    const regex = /(?:₹|Rs?\.\s*)\s*(\d{1,}(?:,\d{3})*(?:\.\d+)?)/;

    const match = priceString.match(regex);
    console.log(match,'match');
    if (match) {
      return parseFloat(match[1]);
    } else {
      // Return 0 if the price format is not recognized
      return 0;
    }
  };

  const sortProducts = (products, order) => {
    const sortedProducts = [...products].sort((a, b) => {
      const priceA = parseFloat(a.meta.rehub_offer_product_price.replace(/[^\d.-]/g, ''));
      const priceB = parseFloat(b.meta.rehub_offer_product_price.replace(/[^\d.-]/g, ''));
      return order === 'low_to_high' ? priceA - priceB : priceB - priceA;
    });
    return sortedProducts;
  };

  const handleSortChange = (order) => {
    const sortedData = sortProducts(under99, order);
    setUnder99(sortedData);
    setSortBy(order);
  };

  const generateVisiblePages = () => {
    const totalVisiblePageNumbers = Math.min(totalPages, maxVisiblePages);
    const firstVisiblePage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const lastVisiblePage = Math.min(totalPages, firstVisiblePage + totalVisiblePageNumbers - 1);
    const pages = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
      pages.push(i);
    }
    setVisiblePages(pages);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const extractNumericalValue = (priceString) => {
    // Regular expression to extract numerical value from the price string
    const regex = /(?:₹|Rs?\.\s*)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/;
    const match = priceString.match(regex);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    } else {
      return NaN; // Return NaN if the price format is not recognized
    }
  };

  const calculateDiscountPercentage = (mainPrice, discountPrice) => {
    const discountAmount = mainPrice - discountPrice;
    if (mainPrice !== 0) {
      const discountPercentage = (discountAmount / mainPrice) * 100;
      return Math.round(discountPercentage);
    } else {
      return NaN; // Return NaN if mainPrice is zero to avoid division by zero error
    }
  };

  const renderPagination = () => {
    return (
      <>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        {visiblePages[0] > 1 && (
          <>
            <button onClick={() => handlePageClick(1)}>1</button>
            {visiblePages[0] > 2 && <span>...</span>}
          </>
        )}
        {visiblePages.map((pageNumber) => (
          <button key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={currentPage === pageNumber ? 'active' : ''}>
            {pageNumber}
          </button>
        ))}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span>...</span>}
            <button onClick={() => handlePageClick(totalPages)}>{totalPages}</button>
          </>
        )}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </>
    );
  };

  // Function to get the class name for the sorting button
  const getButtonClass = (order) => {
    return sortBy === order ? 'sort_by active' : 'sort_by';
  };

  return (
    <div className="under-pages">
      <div className="container-fluid">
        <div className="under_container">
          <div className="top_vertical_filter">
            <h3 className="sort_by_price">Sort by Price</h3>
            <button onClick={() => handleSortChange('low_to_high')} className={getButtonClass('low_to_high')} >
              Low to High
            </button>
            <button onClick={() => handleSortChange('high_to_low')} className={getButtonClass('high_to_low')}>
              High to Low
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
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
              )}
              <div className="pagination">{renderPagination()}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Under299;

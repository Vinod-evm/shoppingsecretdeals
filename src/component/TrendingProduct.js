import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const TrendingProduct = () => {
  const [trendProducts, setTrendProd] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=50`)
      .then(response => response.json())
      .then(data => {
        setTrendProd(data);
        setProductsLoaded(true);
      })
      .catch(error => console.error('Error fetching banners:', error));
  }, []);

  const loadMore = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
  };

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
    <div className={`trending-section margin-top ${productsLoaded ? 'show' : 'hide'}`}>
      {productsLoaded && (
        <>
          <h2 className="heading">Trending Products</h2>
          <div className='trend_grid row'>
            {trendProducts.slice(0, visibleProducts).map(pro => (
              <div key={pro.id} className="col-sm-3">
                <div className='trend-item'>
                  {/* Access the first image URL from the og_image array */}
                  <Link to={pro.slug}><img src={pro.jetpack_featured_media_url} alt={pro.title.rendered} /></Link>
                    <span className='trend_offer_price'>{pro.meta.rehub_offer_product_price}</span>
                    <span className='trend_old_price'><del>{pro.meta.rehub_offer_product_price_old}</del></span>
                    <Link to={pro.slug}><h2 className='product_ttl'>{pro.title.rendered}</h2></Link>
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
          {visibleProducts < trendProducts.length && (
            <button className="loadmore" onClick={loadMore}>Show Next</button>
          )}
        </>
      )}
    </div>
  );
};

export default TrendingProduct;

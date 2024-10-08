import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const TrendingProduct = () => {
  const [trendProducts, setTrendProd] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loading, setLoading] = useState(true); // Loader state
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const cachedProducts = localStorage.getItem('trendProducts');

    if (cachedProducts) {
      setTrendProd(JSON.parse(cachedProducts));
      setLoading(false); // Stop loading when data is fetched from cache
      setProductsLoaded(true);
    } else {
      fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=50`)
        .then(response => response.json())
        .then(data => {
          setTrendProd(data);
          localStorage.setItem('trendProducts', JSON.stringify(data)); // Cache products
          setLoading(false);
          setProductsLoaded(true);
        })
        .catch(error => console.error('Error fetching banners:', error));
    }
  }, [baseUrl]);

  const loadMore = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
  };

  const extractNumericalValue = (priceString) => {
    return parseFloat(priceString.replace(/[^\d.-]/g, ''));
  };

  const calculateDiscountPercentage = (mainPrice, discountPrice) => {
    const discountAmount = mainPrice - discountPrice;
    const discountPercentage = (discountAmount / mainPrice) * 100;
    return Math.round(discountPercentage);
  };

  const isMobile = () => window.innerWidth <= 767;

  return (
    <div className={`trending-section margin-top ${productsLoaded ? 'show' : 'hide'}`}>
      {loading ? (
        // Show skeleton loaders while data is loading
        <div className="trend-grid row skeleton-container">
          {Array.from({ length: visibleProducts }).map((_, idx) => (
            <div key={idx} className="col-sm-12 col-md-3">
              {isMobile() ? (
                <div className="skeleton-item mobile-skeleton">
                  <div className="trend_box skeleton-box">
                    <div className="image_section skeleton-image"></div>
                    <div className="title_price skeleton-title"></div>
                    <div className="skeleton-price"></div>
                  </div>
                  <div className="buy_btn skeleton-button"></div>
                </div>
              ) : (
                <div className="skeleton-item">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-price"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-button"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="heading">Trending Products</h2>
          <div className='trend_grid row'>
            {trendProducts.slice(0, visibleProducts).map(pro => (
              <div key={pro.id} className="col-sm-12 col-md-3">
                {isMobile() ? (
                  <div className='trend-item mobile-item'>
                    <div className="trend_box">
                      <div className='image_section'>
                        <Link to={pro.slug}><img src={pro.jetpack_featured_media_url} alt={pro.title.rendered} /></Link>
                        <span className='discount_percentage'>
                          {calculateDiscountPercentage(
                            extractNumericalValue(pro.meta.rehub_offer_product_price_old),
                            extractNumericalValue(pro.meta.rehub_offer_product_price)
                          )}%
                        </span>
                      </div>
                      <div className='title_price'>
                        <Link to={pro.slug}><h2 className='product_ttl'>{pro.title.rendered}</h2></Link>
                        <span className='trend_offer_price'>{pro.meta.rehub_offer_product_price}</span>
                        <span className='trend_old_price'><del>{pro.meta.rehub_offer_product_price_old}</del></span>
                      </div>
                    </div>
                    <a target="_blank" className="buy_btn" href={pro.meta.rehub_offer_product_url}>Buy it now</a>
                  </div>
                ) : (
                  <div className='trend-item'>
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
                    <a target="_blank" className="buy_btn" href={pro.meta.rehub_offer_product_url}>Buy it now</a>
                  </div>
                )}
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

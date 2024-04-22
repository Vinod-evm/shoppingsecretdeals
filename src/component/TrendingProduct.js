import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const TrendingProduct = () => {
  const [trendProducts, setTrendProd] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);

  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/posts?per_page=50')
      .then(response => response.json())
      .then(data => setTrendProd(data))
      .catch(error => console.error('Error fetching banners:', error));
  }, []);

  const loadMore = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
  };

  return (
    <div className='trending-section margin-top'>
      <h2 className="heading">Trending Products</h2>
      <div className='trend_grid row'>
        {trendProducts.slice(0, visibleProducts).map(pro => (
          <div key={pro.id} className="col-sm-3">
            <div className='trend-item'>
            {/* Access the first image URL from the og_image array */}
            <Link to={pro.slug}>
              <img src={pro.jetpack_featured_media_url} alt={pro.name} />
              <span className='trend_offer_price'>{pro.meta.rehub_main_product_price}</span>
              <span className='trend_old_price'><del>{pro.meta.rehub_offer_product_price}</del></span>
              <h2 className='product_ttl'>{pro.title.rendered}</h2>
            </Link>
            <a className="buy_btn" href={pro.meta.rehub_offer_product_url}>
              Buy it now
            </a>
          </div>
          </div>
        ))}
      </div>
      {visibleProducts < trendProducts.length && (
        <button className="loadmore" onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default TrendingProduct;

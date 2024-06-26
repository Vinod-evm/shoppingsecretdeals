import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategorySidebar from '../component/CategorySidebar';

const ProductDetail = () => {
  const { slug } = useParams(); // Get the dynamic slug from the URL
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch product details using the slug
    fetch(`${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setProduct(data[0]); // Set product data if found
        } else {
          console.error('Product not found');
        }
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [slug]); // Include slug in dependency array to re-fetch when it changes


  useEffect(() => {
    // Fetch recommended products with the same category
    if (product && product.categories.length > 0) {
      const categoryId = product.categories[0]; // Assuming the product has only one category
      fetch(`${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=4`)
        .then(response => response.json())
        .then(data => {
          setRecommendedProducts(data); // Set recommended products
        })
        .catch(error => console.error('Error fetching recommended products:', error));
    }
  }, [product]);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Sidebar - Category List */}
        <div className="col-md-3">
         <CategorySidebar/>
        </div>
        {/* Right Sidebar - Product Details */}
        <div className="col-md-9">
          {/* Render product details */}
          {product && (
            <div className="product-details">
              <div className='pdp_img_ttl'>
                <img src={product.jetpack_featured_media_url} alt={product.title.rendered} />
                <h2>{product.title.rendered}</h2>
                {/* Display both prices */}
              </div>
              <div className='pdp_price_butn'>
                <div className="pdp-prices">
                  <span className='pdp_offer_price'>{product.meta.rehub_offer_product_price}</span>
                  <span className='pdp_old_price'><del>{product.meta.rehub_offer_product_price_old}</del></span>
                </div>
                <a target="_blank" className="pdp_buy_btn" href={product.meta.rehub_offer_product_url}>
                  Buy it Now
                </a>
              </div>
              <p dangerouslySetInnerHTML={{ __html: product.content.rendered }} />
              {/* "Buy Now" button */}
              {/* Recommendation section */}
              <h3 className='related_heading'>Related Articles</h3>
              <div className="row">
                {recommendedProducts.map(recommendedProduct => (
                  <div key={recommendedProduct.id} className="col-md-3">
                    <div className="recommended-product">
                      <Link to={`/${recommendedProduct.slug}`}>
                        <img src={recommendedProduct.jetpack_featured_media_url} alt={recommendedProduct.title.rendered} />
                        <h4>{recommendedProduct.title.rendered}</h4>
                        <div className="recommended-prices">
                          <span className='recommended-offer-price'>{recommendedProduct.meta.rehub_offer_product_price}</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

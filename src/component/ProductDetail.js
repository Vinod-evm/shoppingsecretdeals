// ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { slug } = useParams(); // Get the dynamic slug from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/posts?slug=${slug}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setProduct(data[0]); // Set product data if found
        } else {
          console.error('Product not found');
        }
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [slug]); // Include slug in dependency array to re-fetch when it changes

  return (
    <div>
      {product && (
        <div className="pro-item">
          {/* Render product details */}
          <h2>{product.title.rendered}</h2>
          <p>{product.content.rendered}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { slug } = useParams(); // Get the dynamic slug from the URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  console.log(category, "category");
  console.log(products, "products");

  useEffect(() => {
    // Fetch category information using the slug
    fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/categories/?slug=${slug}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setCategory(data[0]); // Set category data if found
          const categoryId = data[0].id;
          // Fetch products associated with the category using the category ID
          fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/posts?categories=${categoryId}`)
            .then(response => response.json())
            .then(productsData => {
              setProducts(productsData); // Set product data
            })
            .catch(error => console.error('Error fetching products:', error));
        } else {
          console.error('Category not found');
        }
      })
      .catch(error => console.error('Error fetching category:', error));
  }, [slug]); // Include slug in dependency array to re-fetch when it changes

  return (
    <div>
      {category && (
        <h1>{category.name}</h1>
      )}
      {products.map(product => (
        <div key={product.id} className="product-item">
          {/* Render product details */}
          <h2>{product.title.rendered}</h2>
        </div>
      ))}
    </div>
  );
};

export default ProductDetail;

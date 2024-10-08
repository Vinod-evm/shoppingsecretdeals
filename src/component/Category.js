import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategorySidebar from '../component/CategorySidebar';
import '../css/categorySidebar.css';

const ProductDetail = () => {
  const { slug } = useParams(); // Get the dynamic slug from the URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch category list
  useEffect(() => {
    const cachedCategories = localStorage.getItem('categoryList');
    if (cachedCategories) {
      setCategoryList(JSON.parse(cachedCategories)); // Set cached category list
    } else {
      fetch(`${baseUrl}/wp-json/wp/v2/categories?per_page=50`)
        .then(response => response.json())
        .then(data => {
          setCategoryList(data); // Set category list
          localStorage.setItem('categoryList', JSON.stringify(data)); // Cache category list
        })
        .catch(error => console.error('Error fetching category list:', error));
    }
  }, []);

  // Fetch category information using the slug
  useEffect(() => {
    const cachedCategory = localStorage.getItem(`category_${slug}`);
    if (cachedCategory) {
      const categoryData = JSON.parse(cachedCategory);
      setCategory(categoryData);
      setProducts(categoryData.products); // Use cached products if available
      setLoading(false); // Set loading to false if data is cached
    } else {
      fetch(`${baseUrl}/wp-json/wp/v2/categories/?slug=${slug}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch category');
          }
          return response.json();
        })
        .then(data => {
          if (data.length > 0) {
            const categoryId = data[0].id;
            setCategory(data[0]); // Set category data if found
            // Fetch products associated with the category using the category ID
            fetch(`${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=50`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to fetch products');
                }
                return response.json();
              })
              .then(productsData => {
                setProducts(productsData); // Set product data
                // Cache category and products
                localStorage.setItem(`category_${slug}`, JSON.stringify({ ...data[0], products: productsData }));
              })
              .catch(error => console.error('Error fetching products:', error));
          } else {
            console.error('Category not found');
          }
        })
        .catch(error => console.error('Error fetching category:', error))
        .finally(() => setLoading(false)); // Set loading to false after fetching
    }
  }, [slug]);

  // Render product details
  const renderProductDetails = () => {
    if (loading) {
      return (
        <div className="cat_skeleton-loader">
          {/* Skeleton loading placeholder */}
          <div className="cat_skeleton-item"></div>
          <div className="cat_skeleton-item"></div>
          <div className="cat_skeleton-item"></div>
          {/* Add more skeleton items as needed */}
        </div>
      );
    }

    if (products.length === 0) {
      return <div>No products found in this category.</div>; // Show a message if no products are found
    }

    return (
      <div className='category-page'>
        <div className='trend_grid row'>
          {products.map(pro => (
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
            {/* Current Category Name */}
            {category && <h1>{category.name}</h1>}
            {/* Trending Products */}
            {renderProductDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

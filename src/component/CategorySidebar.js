import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/categorySidebar.css';

const SidebarTemplate = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch category list
  useEffect(() => {
    // Function to fetch categories
    const fetchSidebarCat = () => {
      fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/categories?per_page=50')
        .then(response => response.json())
        .then(data => {
          setCategoryList(data); // Set category list
          localStorage.setItem('categoryList', JSON.stringify(data)); // Store in local storage
          setLoading(false); // Set loading to false
        })
        .catch(error => {
          console.error('Error fetching category list:', error);
          setLoading(false); // Set loading to false even on error
        });
    };

    // Check local storage for cached categories
    const cachedCategories = localStorage.getItem('categoryList');
    if (cachedCategories) {
      setCategoryList(JSON.parse(cachedCategories)); // Use cached data
      setLoading(false); // Set loading to false
    } else {
      fetchSidebarCat(); // Fetch from API if no cache
    }
  }, []);

  return (
    <div className='category_left'>
      <h2>Categories</h2>
      {/* Render loading skeleton or category list */}
      {loading ? (
        <ul>
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index} className="category_skeleton-item">
              <div className="category_skeleton-text"></div>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {categoryList.map(cat => (
            <li key={cat.id}>
              <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarTemplate;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const CategorySidebar = () => {
  const [categoryList, setCategoryList] = useState([]);


  // Fetch category list
  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/categories?per_page=50')
      .then(response => response.json())
      .then(data => {
        setCategoryList(data); // Set category list
      })
      .catch(error => console.error('Error fetching category list:', error));
  }, []);


  return (
    <>
        <div className='category_left'>
          <h2>Categories</h2>
          {/* Render category list */}
          <ul>
            {categoryList.map(cat => (
              <li key={cat.id}>
                <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
          </div>
    </>
  );
};

export default CategorySidebar;

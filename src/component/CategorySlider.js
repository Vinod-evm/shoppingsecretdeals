import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/categories')
      .then(response => response.json())
      .then(data => {
        // Fetch the first post associated with each category
        const categoryPromises = data.map(category => {
          return fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/posts?categories=${category.id}&_per_page=1`)
            .then(response => response.json())
            .then(posts => {
              // Extract the first image URL from the fetched post
              const firstPost = posts[0];
              if (firstPost && firstPost.jetpack_featured_media_url) {
                return { ...category, image: firstPost.jetpack_featured_media_url };
              }
              return { ...category, image: null };
            });
        });

        // Resolve all promises and set categories with images
        Promise.all(categoryPromises)
          .then(categoriesWithImages => {
            setCategories(categoriesWithImages);
            setShowSlider(true);
          })
          .catch(error => console.error('Error fetching categories:', error));
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const settings = {
    dots: false,
    arrows: showSlider, // Show arrows only when the slider content is loaded
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className={`category-arrow prev-arrow ${showSlider ? 'visible' : 'hidden'}`} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className={`category-arrow next-arrow ${showSlider ? 'visible' : 'hidden'}`} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    );
  };

  return (
    <div className='category_slider margin-top'>
      {showSlider && (
        <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />}>
          {categories.map(category => (
            <div key={category.id} className="category-item">
              <Link to={`/category/${category.slug}`}>
                {/* Render category image if available */}
                {category.image && <img src={category.image} alt={category.name} />}
                {/* Render category name */}
                <span>{category.name}</span>
              </Link>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default CategorySlider;

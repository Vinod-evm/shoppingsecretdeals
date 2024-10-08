import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/CategorySlider.css'; // CSS for skeleton loader

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [showSlider, setShowSlider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cacheDuration = 60 * 60 * 1000; // Cache duration set to 1 hour (in milliseconds)

  useEffect(() => {
    const cachedCategories = localStorage.getItem('categorySliderData');
    const cachedTimestamp = localStorage.getItem('categorySliderTimestamp');
    const currentTime = new Date().getTime();
    const staticIds = [1389, 1010, 96, 980, 974, 989, 987, 1016, 1017, 1038, 1119];

    if (cachedCategories && cachedTimestamp && (currentTime - cachedTimestamp < cacheDuration)) {
      setCategories(JSON.parse(cachedCategories));
      setShowSlider(true);
      setIsLoading(false);
    } else {
      // Fetch category data (name, slug) for each static category ID
      const categoryPromises = staticIds.map(id => {
        return fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/categories/${id}`)
          .then(response => response.json())
          .then(category => {
            // Fetch the first post associated with the category to get the image
            return fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/posts?categories=${category.id}&_per_page=1`)
              .then(response => response.json())
              .then(posts => {
                const firstPost = posts[0];
                if (firstPost && firstPost.jetpack_featured_media_url) {
                  // Combine category details and image
                  return { ...category, image: firstPost.jetpack_featured_media_url };
                }
                return { ...category, image: null };
              });
          });
      });

      Promise.all(categoryPromises)
        .then(categoriesWithImages => {
          setCategories(categoriesWithImages);
          localStorage.setItem('categorySliderData', JSON.stringify(categoriesWithImages)); // Cache the data
          localStorage.setItem('categorySliderTimestamp', currentTime.toString());
          setShowSlider(true);
          setIsLoading(false);
        })
        .catch(error => console.error('Error fetching categories:', error));
    }
  }, []);

  const settings = {
    dots: false,
    arrows: showSlider,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
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
        breakpoint: 980,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
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
      {isLoading ? (
        <div className="category-skeleton-container">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="category-skeleton-item"></div>
          ))}
        </div>
      ) : (
        showSlider && (
          <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />}>
            {categories.map(category => (
              <div key={category.id} className="category-item">
                <Link to={`/category/${category.slug}`}>
                  {category.image && <img src={category.image} alt={category.name} />}
                  <span>{category.name}</span>
                </Link>
              </div>
            ))}
          </Slider>
        )
      )}
    </div>
  );
};

export default CategorySlider;

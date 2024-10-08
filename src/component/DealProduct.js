import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/Dealproduct.css'; // CSS for skeleton loader
import { Link } from 'react-router-dom';


// Skeleton component for loading state
const SkeletonItem = () => (
  <div className="skeleton">
    <div className="skeleton-img"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-text short"></div>
    <div className="skeleton-button"></div>
  </div>
);

const DealProduct = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [showSlider, setShowSlider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;
   const cacheDuration = 60 * 60 * 1000; // Cache duration set to 1 hour (in milliseconds)

   useEffect(() => {
    // Check for cached deal products in localStorage
    const cachedProducts = localStorage.getItem('cachedDealProducts');
    const cachedCategories = localStorage.getItem('cachedCategoryMap');
    const cachedProductTimestamp = localStorage.getItem('dealProductsTimestamp');
    const currentTime = new Date().getTime();
  
    if (cachedProducts && cachedCategories) {
      // Check if product cache is valid
      if (cachedProductTimestamp && (currentTime - cachedProductTimestamp < cacheDuration)) {
        setDealProducts(JSON.parse(cachedProducts));
        setCategoryMap(JSON.parse(cachedCategories));
        setShowSlider(true);
        setIsLoading(false);
      } else {
        // Fetch new deal products if product cache is not valid
        fetchDealPost();
      }
    } else {
      // Fetch new deal products if cache is not available
      fetchDealPost();
    }
  }, []);

  const fetchCategoryNames = (products) => {
    const categoryIds = products.flatMap(pro => pro.categories);
    const uniqueCategoryIds = [...new Set(categoryIds)];
    Promise.all(uniqueCategoryIds.map(id => fetchCategoryInfo(id)))
      .then(categories => {
        const map = uniqueCategoryIds.reduce((acc, id, index) => {
          acc[id] = categories[index];
          return acc;
        }, {});
        setCategoryMap(map);

        // Cache category map in localStorage
        localStorage.setItem('cachedCategoryMap', JSON.stringify(map));
      });
  };

  const fetchDealPost = () => {
    const currentTime = new Date().getTime();
    fetch(`${baseUrl}/wp-json/wp/v2/posts`)
      .then(response => response.json())
      .then(data => {
        setDealProducts(data);
        fetchCategoryNames(data);
        setShowSlider(true);
        setIsLoading(false);

        // Cache the fetched deal products in localStorage
        localStorage.setItem('cachedDealProducts', JSON.stringify(data));
        localStorage.setItem('dealProductsTimestamp', currentTime.toString());
      })
      .catch(error => console.error('Error fetching product:', error));
  };

  const fetchCategoryInfo = (categoryId) => {
    return fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/categories/${categoryId}`)
      .then(response => response.json())
      .then(data => ({
        name: data.name,
        slug: data.slug,
      }))
      .catch(error => {
        console.error('Error fetching category:', error);
        return { name: 'Unknown Category', slug: '' };
      });
  };

  const extractNumericalValue = (priceString) => {
    return parseFloat(priceString.replace(/[^\d.-]/g, ''));
  };

  const calculateDiscountPercentage = (mainPrice, discountPrice) => {
    const discountAmount = mainPrice - discountPrice;
    const discountPercentage = (discountAmount / mainPrice) * 100;
    return Math.round(discountPercentage);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    let initialOffset = null; // Initialize the initial offset
  
    const handleScroll = () => {
      const joinLinkElement = document.getElementById("joinTele");
      if (!joinLinkElement) return; // Element not found, exit early
  
      if (initialOffset === null) {
        initialOffset = joinLinkElement.offsetTop; // Store the initial offset when the sticky behavior starts
      }
  
      // Check if the pageYOffset is greater than or equal to the initialOffset
      if (window.pageYOffset >= initialOffset) {
        joinLinkElement.classList.add("sticky"); // Add sticky class
      } else {
        joinLinkElement.classList.remove("sticky"); // Remove sticky class
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up event listener
    };
  }, []);
  

  return (
    <div className='deal-section margin-top'>
      <div className='loin_link' id="joinTele">
        <a href="https://telegram.me/Shopping_Secret_Deals" target="_blank" rel="noopener noreferrer">
          <svg width="19px" height="16px" viewBox="0 0 19 16" role="img" aria-hidden="true" focusable="false">
            <g>
              <path d="M0.465,6.638 L17.511,0.073 C18.078,-0.145 18.714,0.137 18.932,0.704 C19.009,0.903 19.026,1.121 18.981,1.33 L16.042,15.001 C15.896,15.679 15.228,16.111 14.549,15.965 C14.375,15.928 14.211,15.854 14.068,15.748 L8.223,11.443 C7.874,11.185 7.799,10.694 8.057,10.345 C8.082,10.311 8.109,10.279 8.139,10.249 L14.191,4.322 C14.315,4.201 14.317,4.002 14.195,3.878 C14.091,3.771 13.926,3.753 13.8,3.834 L5.602,9.138 C5.112,9.456 4.502,9.528 3.952,9.333 L0.486,8.112 C0.077,7.967 -0.138,7.519 0.007,7.11 C0.083,6.893 0.25,6.721 0.465,6.638 Z"></path>
            </g>
          </svg>
          Join Our Telegram Channel
        </a>
      </div>
      <h2 className='heading'>Deals Of The Day</h2>

      {isLoading ? (
        <div className="skeleton-slider">
          {/* Show skeleton loader while data is being fetched */}
          {[...Array(5)].map((_, index) => <SkeletonItem key={index} />)}
        </div>
      ) : (
        showSlider && (
          <Slider {...settings}>
            {dealProducts.map(pro => (
              <div key={pro.id} className="deal-item">
                <Link to={pro.slug}><img src={pro.jetpack_featured_media_url} alt={pro.title.rendered} /></Link>
                <span className='offer_price'>{pro.meta.rehub_offer_product_price}</span>
                <span className='old_price'><del>{pro.meta.rehub_offer_product_price_old}</del></span>
                <Link to={pro.slug}><h2 className='product_ttl'>{pro.title.rendered}</h2></Link>
                <span className='discount_percentage'>
                  {calculateDiscountPercentage(
                    extractNumericalValue(pro.meta.rehub_offer_product_price_old),
                    extractNumericalValue(pro.meta.rehub_offer_product_price)
                  )}%
                </span>
                <a target="_blank" className="buy_btn" href={pro.meta.rehub_offer_product_url}>
                  Buy it now
                </a>
                <div className="category_info"> 
                  {categoryMap[pro.categories[0]] && categoryMap[pro.categories[0]].slug && (
                    <Link to={`category/${categoryMap[pro.categories[0]].slug}`}>{categoryMap[pro.categories[0]].name}</Link>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        )
      )}
    </div>
  );
};

export default DealProduct;

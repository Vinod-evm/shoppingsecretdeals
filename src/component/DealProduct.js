import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const DealProduct = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
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
        });
    };
    function fetchDealPost() {
      fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/posts')
        .then(response => response.json())
        .then(data => {
          setDealProducts(data);
          fetchCategoryNames(data);
          setShowSlider(true);
        })
        .catch(error => console.error('Error fetching product:', error));
    }
  
    fetchDealPost();
  }, []);
  



  const fetchCategoryInfo = (categoryId) => {
    return fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/categories/${categoryId}`)
      .then(response => response.json())
      .then(data => ({
        name: data.name,
        slug: data.slug
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

  return (
    <div className='deal-section margin-top'>
      {showSlider && (
        <>
          <div className='loin_link'>
            <a href="https://telegram.me/Shopping_Secret_Deals" target="_self" rel="noopener noreferrer">
              <svg width="19px" height="16px" viewBox="0 0 19 16" role="img" aria-hidden="true" focusable="false">
                <g>
                  <path d="M0.465,6.638 L17.511,0.073 C18.078,-0.145 18.714,0.137 18.932,0.704 C19.009,0.903 19.026,1.121 18.981,1.33 L16.042,15.001 C15.896,15.679 15.228,16.111 14.549,15.965 C14.375,15.928 14.211,15.854 14.068,15.748 L8.223,11.443 C7.874,11.185 7.799,10.694 8.057,10.345 C8.082,10.311 8.109,10.279 8.139,10.249 L14.191,4.322 C14.315,4.201 14.317,4.002 14.195,3.878 C14.091,3.771 13.926,3.753 13.8,3.834 L5.602,9.138 C5.112,9.456 4.502,9.528 3.952,9.333 L0.486,8.112 C0.077,7.967 -0.138,7.519 0.007,7.11 C0.083,6.893 0.25,6.721 0.465,6.638 Z"></path>
                </g>
              </svg>
              Join Our Telegram Channel
            </a>
          </div>
          <h2 className='heading'>Deals Of The Day</h2>
          <Slider {...settings}>
          {dealProducts.map(pro => (
          <div key={pro.id} className="deal-item">
            <Link to={pro.slug}><img src={pro.jetpack_featured_media_url} alt={pro.name} /></Link>
            <span className='offer_price'>{pro.meta.rehub_offer_product_price}</span>
            <span className='old_price'><del>{pro.meta.rehub_offer_product_price_old}</del></span>
            <Link to={pro.slug}><h2 className='product_ttl'>{pro.title.rendered}</h2></Link>
            <span className='discount_percentage'>
              {calculateDiscountPercentage(
                extractNumericalValue(pro.meta.rehub_offer_product_price_old),
                extractNumericalValue(pro.meta.rehub_offer_product_price)
              )}%
            </span>
            <a className="buy_btn" href={pro.meta.rehub_offer_product_url}>
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
        </>
      )}
    </div>
  );
};

export default DealProduct;

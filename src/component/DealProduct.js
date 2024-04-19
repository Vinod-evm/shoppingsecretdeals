import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DealProduct = () => {
  const [dealProducts, setDealPro] = useState([]);

  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/posts')
      .then(response => response.json())
      .then(data => setDealPro(data))
      .catch(error => console.error('Error fetching product:', error));
  }, []);

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
    <div>
        <h2>Deals Of The Day</h2>
      <Slider {...settings}>
        {dealProducts.map(pro => (
          <div key={pro.id} className="deal-item">
            {/* Access the first image URL from the og_image array */}
            <a href={pro.slug}>
              <img src={pro.jetpack_featured_media_url} alt={pro.name} />
              <span>{pro.meta.rehub_main_product_price}</span>
              <span>{pro.meta.rehub_offer_product_price}</span>
              <h2>{pro.title.rendered}</h2>
            </a>
            <a className="buy_btn" href={pro.meta.rehub_offer_product_url}>
              Buy it now
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DealProduct;

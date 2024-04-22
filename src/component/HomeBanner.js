import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/home_banner')
      .then(response => response.json())
      .then(data => setBanners(data))
      .catch(error => console.error('Error fetching banners:', error));
  }, []);

  // Settings for the carousel slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <Slider {...settings}>
        {banners.map(banner => (
          <div key={banner.id} className="banner-item">
            <img src={banner.yoast_head_json.og_image[0].url} alt={banner.title.rendered} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeBanner;

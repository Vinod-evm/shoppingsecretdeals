import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/home_banner')
      .then(response => response.json())
      .then(data => setBanners(data))
      .catch(error => console.error('Error fetching banners:', error));
  }, []);

  // Function to handle banner image load
  const handleBannerLoad = () => {
    setBannerLoaded(true);
  };

// Custom arrow component for the previous arrow
function CustomPrevArrow(props) {
  const { onClick } = props;
  return (
    <div className="banner-arrow left-arrow" onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  );
}

// Custom arrow component for the next arrow
function CustomNextArrow(props) {
  const { onClick } = props;
  return (
    <div className="banner-arrow right-arrow" onClick={onClick}>
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  );
}


  // Settings for the carousel slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: bannerLoaded, // Show arrows only when the banner image is loaded
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className='home_banner'>
      {banners.length > 0 && (
        <Slider {...settings}>
          {banners.map(banner => (
            <div key={banner.id} className="banner-item">
              <img
                src={banner.yoast_head_json.og_image[0].url}
                alt={banner.title.rendered}
                onLoad={handleBannerLoad}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default HomeBanner;

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../css/HomeBanner.css'; // Add a CSS file for skeleton styles

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const cacheDuration = 60 * 60 * 1000; // Cache duration set to 1 hour (in milliseconds)

  useEffect(() => {
    const cachedData = localStorage.getItem('homeBanners');
    const cachedTimestamp = localStorage.getItem('homebannerTimestamp');
    const currentTime = new Date().getTime();
    
    if (cachedData && cachedTimestamp && (currentTime - cachedTimestamp < cacheDuration)) {
      setBanners(JSON.parse(cachedData));
      setLoading(false); // No need to fetch if data is cached
    } else {
      fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/home_banner')
        .then(response => response.json())
        .then(data => {
          setBanners(data);
          localStorage.setItem('homeBanners', JSON.stringify(data)); // Cache banners in localStorage
          localStorage.setItem('homebannerTimestamp', currentTime.toString());
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching banners:', error);
          setLoading(false); // Stop loading even on error
        });
    }
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
    <div className="home_banner">
      {loading ? (
        // Show skeleton loader while loading
        <div className="banner-skeleton">
          {/* Skeleton placeholder for the banner */}
          <div className="skeleton-item"></div>
        </div>
      ) : (
        banners.length > 0 && (
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
        )
      )}
    </div>
  );
};

export default HomeBanner;

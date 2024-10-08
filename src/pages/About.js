import React, { useState, useEffect } from 'react';
import '../css/AffiliateDisclosures.css';

// Utility function to fetch and cache data
const fetchAndCacheData = async (key, url, cacheDuration) => {
  const cachedData = localStorage.getItem(key);
  const cachedTimestamp = localStorage.getItem(`${key}Timestamp`);
  const currentTime = new Date().getTime();

  if (cachedData && cachedTimestamp && (currentTime - cachedTimestamp < cacheDuration)) {
    return JSON.parse(cachedData); // Load from cache
  } else {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    if (data.length > 0) {
      localStorage.setItem(key, JSON.stringify(data[0])); // Cache data
      localStorage.setItem(`${key}Timestamp`, currentTime.toString()); // Cache timestamp
      return data[0];
    } else {
      console.log('No data found for the requested page.');
      return null;
    }
  }
};

const Skeleton = () => (
  <div className="skeleton-container container-fluid">
    <div className="skeleton-title"></div>
    <div className="skeleton-content"></div>
    <div className="skeleton-content"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-content"></div>
  </div>
);

const AboutUsPage = () => {
  const [aboutUsData, setAboutUsData] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const cacheDuration = 60 * 60 * 1000; // Cache for 1 hour

  useEffect(() => {
    const fetchAboutUsContent = async () => {
      try {
        const data = await fetchAndCacheData('aboutUs', `${baseUrl}/wp-json/wp/v2/pages/?slug=about-us-new/`, cacheDuration);
        setAboutUsData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAboutUsContent();
  }, [baseUrl, cacheDuration]);

  if (!aboutUsData) {
    return <Skeleton />; // Show skeleton while loading
  }

  return (
    <div className='about-page'>
      <div className='banner_section' style={{ backgroundImage: `url(${aboutUsData.acf.banner_image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '300px' }}>
        <div className='banner'>
          <h1 className='banner_heading'>{aboutUsData.acf.who_we_are}</h1>
        </div>
      </div>

      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-6 d-flex align-items-center'>
            <div className='custom-content'>
              <img src={aboutUsData.acf.first_image} alt='First' className='img-fluid' />
            </div>
          </div>
          <div className='col-md-6 d-flex align-items-center'>
            <div className='custom-content'>
              <div dangerouslySetInnerHTML={{ __html: aboutUsData.acf.first_content }} />
            </div>
          </div>
        </div>

        <div className='row mt-5'>
          <div className='col-md-6'>
            <div className='custom-content-1'>
              <div dangerouslySetInnerHTML={{ __html: aboutUsData.acf.second_content }} />
            </div>
          </div>
          <div className='col-md-6'>
            <div className='custom-content-2'>
              <img src={aboutUsData.acf.second_image} alt='Second' className='img-fluid' />
            </div>
          </div>
        </div>

        <div className='happy-shopping-section custom-happy-shopping-section' style={{ backgroundImage: `url(${aboutUsData.acf.happy_shopping_image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 'auto' }}>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <div className='happy_con' dangerouslySetInnerHTML={{ __html: aboutUsData.acf.happy_shopping_content }} />
                <h2 className='happy_ttl'>{aboutUsData.acf.happy_shopping}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='row mt-5'>
        <div className='best_deal_section'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='best-deal-left'>
                  {/* Content for the left side */}
                </div>
              </div>
              <div className='col-md-6'>
                <div className='best-deal-right'>
                  <img src={aboutUsData.acf.best_deal_image} alt='Best Deal' className='img-fluid' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;

import React, { useState, useEffect } from 'react';
import tegramImage from '../images/telegramimage.png';
import fb from "../images/fb.png"
import insta from "../images/insta.png"
import twitter from "../images/twitter.png"
import telegram from "../images/telegram.png"
import '../css/AffiliateDisclosures.css';

const Skeleton = () => (
  <div className="skeleton-container container-fluid">
    <div className="skeleton-title"></div>
    <div className="skeleton-content"></div>
    <div className="skeleton-content"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-content"></div>
  </div>
);

const ContactPage = () => {
  const [contactData, setContactData] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const cacheDuration = 60 * 60 * 1000; // Cache for 1 hour

  useEffect(() => {
    const fetchContactContent = async () => {
      const cacheKey = 'contactPageData';
      const cachedData = localStorage.getItem(cacheKey);

      // Check if cached data is available and still valid
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < cacheDuration) {
          setContactData(data);
          return;
        }
      }

      // Fetch data from API if not cached or cache expired
      try {
        const response = await fetch(`${baseUrl}/wp-json/wp/v2/pages/?slug=contact-page-new/`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data.length > 0) {
          setContactData(data[0]);

          // Store the fetched data in local storage
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data[0] }));
        } else {
          console.log('No data found for the "contact" page.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchContactContent();
  }, [baseUrl, cacheDuration]);

  if (!contactData) {
    return <Skeleton />; // Show skeleton while loading
  }

  return (
    <div className='contact-page'>
      <div className='banner_section' style={{ backgroundImage: `url(${contactData.acf.banner_image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '300px' }}>
        <div className='banner'>
          <h1 className='banner_heading'>{contactData.acf.banner_title}</h1>
        </div>
      </div>

      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-6 d-flex align-items-center'>
            <div className='contact_image_area'>
              <img src={contactData.acf.contact_right_image} alt='Contact Right' className='img-fluid' />
            </div>
          </div>
          <div className='col-md-6 d-flex align-items-center'>
            <div className='contact_social_area'>
              <div className='social_links'>
                <a href={contactData.acf.facebook_link} target='_blank' rel='noopener noreferrer'><img alt='fb' src={fb} /></a>
                <a href={contactData.acf.twitter_link} target='_blank' rel='noopener noreferrer'><img alt='x' src={twitter} /></a>
                <a href={contactData.acf.instagram_link} target='_blank' rel='noopener noreferrer'><img alt='insta' src={insta} /></a>
                <a href={contactData.acf.telegram_link} target='_blank' rel='noopener noreferrer'><img alt='tel' src={telegram} /></a>
              </div>
              <div className='telegram_button'>
                <a href="https://telegram.me/Shopping_Secret_Deals">
                  <img alt='tel' src={tegramImage} />Join Our Telegram Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

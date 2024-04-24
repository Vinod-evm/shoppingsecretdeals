import React, { useState, useEffect } from 'react';
import tegramImage from '../images/telegramimage.png';
import fb from "../images/fb.png"
import insta from "../images/insta.png"
import twitter from "../images/twitter.png"
import telegram from "../images/telegram.png"

const ContactPage = () => {
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const response = await fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/pages/?slug=contact-page-new/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data.length > 0) {
          setContactData(data[0]);
        } else {
          console.log('No data found for the "contact" page.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchContactContent();
  }, []);

  if (!contactData) {
    return <div>Loading...</div>;
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
              <img src={contactData.acf.contact_right_image} alt='Contact Right Image' className='img-fluid' />
            </div>
          </div>
          <div className='col-md-6 d-flex align-items-center'>
            <div className='contact_social_area'>
              <div className='social_links'>
                <a href={contactData.acf.facebook_link} target='_blank' rel='noopener noreferrer'><img src={fb} /></a>
                <a href={contactData.acf.twitter_link} target='_blank' rel='noopener noreferrer'><img src={twitter}/></a>
                <a href={contactData.acf.instagram_link} target='_blank' rel='noopener noreferrer'><img src={insta}/></a>
                <a href={contactData.acf.telegram_link} target='_blank' rel='noopener noreferrer'><img src={telegram}/></a>
              </div>
              <div className='telegram_button'><a><img src={tegramImage} />Join Our Telegram Channel</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

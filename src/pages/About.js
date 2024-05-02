import React, { useState, useEffect } from 'react';

const AboutUsPage = () => {
  const [aboutUsData, setAboutUsData] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchAboutUsContent = async () => {
      try {
        const response = await fetch(`${baseUrl}/wp-json/wp/v2/pages/?slug=about-us-new/`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data.length > 0) {
          setAboutUsData(data[0]);
        } else {
          console.log('No data found for the "about-us" page.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAboutUsContent();
  }, []);

  if (!aboutUsData) {
    return <div>Loading...</div>;
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

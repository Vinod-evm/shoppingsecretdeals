import React, { useState, useEffect } from 'react';

const AffiliateDisclosures = () => {
  const [affiliateDisclosuresData, setAffiliateDisclosuresData] = useState(null);

  useEffect(() => {
    const fetchAffiliateDisclosuresContent = async () => {
      try {
        const response = await fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/pages/?slug=affiliate-disclosures-new/');
        if (!response.ok) {
          throw new Error('Failed to fetch affiliate disclosures data');
        }
        const data = await response.json();
        if (data.length > 0) {
          setAffiliateDisclosuresData(data[0]);
        } else {
          console.log('No data found for the "affiliate disclosures" page.');
        }
      } catch (error) {
        console.error('Error fetching affiliate disclosures data:', error);
      }
    };
    fetchAffiliateDisclosuresContent();
  }, []);

  if (!affiliateDisclosuresData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='affiliate-disclosures-page'>  
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <div className='affiliate_section'>
            <h2 className='affiliate_top_ttl'>{affiliateDisclosuresData.title.rendered}</h2>
            <div className='affiliate_con' dangerouslySetInnerHTML={{ __html: affiliateDisclosuresData.content.rendered }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDisclosures;

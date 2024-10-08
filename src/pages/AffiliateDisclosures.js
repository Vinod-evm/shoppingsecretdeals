import React, { useState, useEffect } from 'react';
import '../css/AffiliateDisclosures.css'; // Add your CSS file for skeleton loader

// Skeleton component for loading state
const Skeleton = () => (
  <div className="skeleton-container container-fluid">
    <div className="skeleton-title"></div>
    <div className="skeleton-content"></div>
  </div>
);

const AffiliateDisclosures = () => {
  const [affiliateDisclosuresData, setAffiliateDisclosuresData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const cacheDuration = 60 * 60 * 1000; // Cache for 1 hour

  useEffect(() => {
    const cachedData = localStorage.getItem('affiliateDisclosures');
    const cachedTimestamp = localStorage.getItem('affiliateDisclosuresTimestamp');
    const currentTime = new Date().getTime();

    if (cachedData && cachedTimestamp && (currentTime - cachedTimestamp < cacheDuration)) {
      setAffiliateDisclosuresData(JSON.parse(cachedData)); // Load from cache
      setLoading(false);
    } else {
      fetchAffiliateDisclosuresContent(); // Fetch from API
    }
  }, []);

  const fetchAffiliateDisclosuresContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/wp-json/wp/v2/pages/?slug=affiliate-disclosures-new/`);
      if (!response.ok) {
        throw new Error('Failed to fetch affiliate disclosures data');
      }
      const data = await response.json();
      if (data.length > 0) {
        setAffiliateDisclosuresData(data[0]);
        localStorage.setItem('affiliateDisclosures', JSON.stringify(data[0])); // Cache data
        localStorage.setItem('affiliateDisclosuresTimestamp', new Date().getTime().toString()); // Cache timestamp
      } else {
        console.log('No data found for the "affiliate disclosures" page.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching affiliate disclosures data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton />; // Show skeleton while loading
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

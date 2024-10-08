import React, { useState, useEffect } from 'react';
import '../css/EverythingUnder.css'; // Add this for skeleton styling

const EverythingUnder = () => {
  const [unders, setUnder] = useState([]);
  const [loading, setLoading] = useState(true);
  const cacheDuration = 60 * 60 * 1000; // Cache duration set to 1 hour (in milliseconds)

  useEffect(() => {
    const cachedData = localStorage.getItem('everythingUnderData');
    const cachedTimestamp = localStorage.getItem('everythingunderTimestamp');
    const currentTime = new Date().getTime();
    
    if (cachedData && cachedTimestamp && (currentTime - cachedTimestamp < cacheDuration)) {
      setUnder(JSON.parse(cachedData));
      setLoading(false); // Stop loading if data is cached
    } else {
      fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/everythingunder')
        .then(response => response.json())
        .then(data => {
          setUnder(data);
          localStorage.setItem('everythingUnderData', JSON.stringify(data)); // Cache the data in localStorage
          localStorage.setItem('everythingunderTimestamp', currentTime.toString());
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching banners:', error);
          setLoading(false); // Stop loading even on error
        });
    }
  }, []);

  return (
    <div className="under_section">
      <div className="under-container">
        {loading ? (
          // Skeleton loader while the data is being fetched
          <div className="under-skeleton-container">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="under-skeleton-item"></div>
            ))}
          </div>
        ) : (
          unders.slice().reverse().map(under => (
            <div key={under.id} className="under-item">
              <a href={under.slug}>
                <img
                  src={under.yoast_head_json.og_image[0].url}
                  alt={under.title.rendered}
                />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EverythingUnder;

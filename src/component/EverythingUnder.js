import React, { useState, useEffect } from 'react';

const EverythingUnder = () => {
  const [unders, setUnder] = useState([]);

  useEffect(() => {
    fetch('https://shoppingsecretdeals.com/wp-json/wp/v2/everythingunder')
      .then(response => response.json())
      .then(data => setUnder(data))
      .catch(error => console.error('Error fetching banners:', error));
  }, []);

  return (
    <div>
      <div className="under-container">
        {unders.slice().reverse().map(under => (
          <div key={under.id} className="under-item">
            {/* Access the first image URL from the og_image array */}
            <a href={under.slug}>
            <img src={under.yoast_head_json.og_image[0].url} alt={under.title.rendered} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EverythingUnder
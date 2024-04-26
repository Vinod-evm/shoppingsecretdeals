import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    function clickAnywhere(){
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };}
    clickAnywhere();
  }, []);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchResults([]);
    navigate(`/search/${searchTerm}`);
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/posts?search=${value}&_embed`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const filteredResults = showAllResults ? searchResults : searchResults.slice(0, 5);

  return (
    <div className='search_form' ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
        />
        <button className='form_btn' type="submit"> <FontAwesomeIcon icon={faSearch} /></button>
      </form>
      {searchResults.length > 0 && (
        <div className="live-search-results">
          {filteredResults.map((result) => (
            <div className='list_pro' key={result.id}>
              <div className='search_pro s_pro_img'><Link to={`/${result.slug}`}><img src={result.jetpack_featured_media_url} alt={result.title.rendered} /></Link> </div>
              <div className='search_pro s_pro_ttl'><Link to={`/${result.slug}`}><h4 onClick={() => setSearchResults([])}>{result.title.rendered}</h4></Link><span>{result.meta.rehub_offer_product_price}</span></div>
            </div>
          ))}
          {!showAllResults && searchResults.length > 5 && (
            <button onClick={handleSubmit}>View All Results</button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchForm;

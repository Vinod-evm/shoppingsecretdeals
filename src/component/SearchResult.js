// SearchResult.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SearchResult = () => {
  const { searchTerm } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  console.log(searchResults,"searchResults");

  useEffect(() => {
    fetch(`https://shoppingsecretdeals.com/wp-json/wp/v2/search/?search=${searchTerm}`)
      .then(response => response.json())
      .then(data => setSearchResults(data))
      .catch(error => console.error('Error fetching search results:', error));
  }, [searchTerm]);

  return (
    <div>
      <h2>Search Results for: {searchTerm}</h2>
      <ul>
        {searchResults.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;

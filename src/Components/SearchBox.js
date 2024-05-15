import React, { useState, useEffect } from "react";
import axios from "axios";
import "./searchBox.css";

function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.first.org/data/v1/countries"
        );
        const countries = Object.values(response.data.data).map(
          (item) => item.country
        );
        setResults(countries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const filterResults = (query) => {
    if (query === "") {
      setFilteredResults([]);
    } else {
      setFilteredResults(
        results.filter((result) =>
          result.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const debouncedFilterResults = debounce(filterResults, 2000);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedFilterResults(value);
  };

  const handleItemClick = (item) => {
    setQuery(item); // Set query to the selected item
    setFilteredResults([]); // Clear the results after selection
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
      />
      {filteredResults.length > 0 && (
        <ul className="search-results">
          {filteredResults.map((result, index) => (
            <li key={index} onClick={() => handleItemClick(result)}>
              {result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBox;

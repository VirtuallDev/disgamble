import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './searchinput.css';

const SearchInput = ({ searchValue, setSearchValue, width, placeholder }) => {
  return (
    <div
      className="search-container"
      style={{ width: width }}>
      <input
        autoComplete="off"
        className="search"
        placeholder={placeholder}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}></input>
      <FaSearch
        className="fasearch"
        size={'2em'}
        color={'rgb(139, 139, 139)'}></FaSearch>
    </div>
  );
};

export default SearchInput;

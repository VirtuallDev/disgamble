import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './searchinput.css';

const SearchInput = ({ searchValue, setSearchValue, width, placeholder }) => {
  return (
    <div
      className="search-container"
      style={{ width: width }}>
      <input
        className="search"
        placeholder={placeholder}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}></input>
      <FaSearch
        style={{ position: 'absolute', right: '1em' }}
        size={'1.8em'}
        color={'rgb(139, 139, 139)'}></FaSearch>
    </div>
  );
};

export default SearchInput;

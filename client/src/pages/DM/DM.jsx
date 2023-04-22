import React, { useState } from 'react';

import './dm.css';
import SearchInput from '../../components/Global/SearchInput';
const DM = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="dm-container">
      <div className="dm-header">
        <img
          className="dm-image"
          src=""
          alt=""></img>
        <p className="dm-name">NitayF1xPlayer</p>
      </div>
      <div className="dm-messages"></div>
    </div>
  );
};

export default DM;
/* <SearchInput
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            width={'10em'}
            placeholder={'Search a message!'}></SearchInput>*/

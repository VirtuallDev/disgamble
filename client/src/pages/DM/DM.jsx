import React, { useState } from 'react';
import { FriendsList } from '../../components/Home/Friend';
import User from '../../components/Home/user';

import './dm.css';
import SearchInput from '../../components/Global/SearchInput';
const DM = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="home-container">
      <div className="right-side">
        <FriendsList />
        <User />
      </div>
      <div className="left-side">
        <div className="dm-header">
          <p className="dm-name">NitayF1xPlayer</p>
          <SearchInput
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            width={'100%'}
            placeholder={'Search a message!'}></SearchInput>
        </div>
      </div>
    </div>
  );
};

export default DM;

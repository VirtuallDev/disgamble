import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserObject } from '../redux/user';
import useAuth from './useAuth';

function useUpdateUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { useApi, useSocket, socket } = useAuth();

  async function fetchUser() {
    try {
      const jsonResponse = await useApi('getuserinfo');
      if (jsonResponse.success) dispatch(setUserObject(jsonResponse.success));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  return { loading, fetchUser };
}

export default useUpdateUser;

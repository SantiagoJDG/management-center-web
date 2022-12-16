import { useState, useEffect } from 'react';
import { getAxiosInstance } from '../utils/axiosClient';
import useAuth from '../hooks/useAuth';

const Collaborators = () => {

  const { userToken, getUserData, waitingUser } = useAuth();

  useEffect(() => {
    if (!userToken) return;

  }, [waitingUser, userToken]);

  return (
    <>
      <h1> Collaborators Page!</h1>
    </>
  );
};

export default Collaborators;

"use client"
import React from 'react';
import ProfilePageComponent from './ProfilePageComp';
import { useUserAuth } from "../components/_utils/auth-context";

const ProfilePage = () => {
  const { user } = useUserAuth();

  return <ProfilePageComponent user={user} />;

  
};

export default ProfilePage;

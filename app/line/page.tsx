"use client";

import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import { useMainStorage } from "@/store/mainStorage";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
const router = useRouter()
const {user, setUser, setToken,token} = useMainStorage()
  useEffect(() => {
    liff
      .init({
        liffId:process.env.NEXT_PUBLIC_LIFF_ID ,
      })
      .then(() => {
        handleLogin();
      })
      .catch((error) => {
        console.error("LIFF initialization failed:", error);
      });
  }, []);
console.log("object")
  const handleLogin = async () => {
    try {
      const userProfile = await liff.getProfile();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/line/`,{userProfile})
      console.log(response)
      setUser(response.data.user)
      setToken(response.data.token)
      document.cookie = `token=${response.data.token}`;
      document.cookie = `token=${response.data.user.id}`;
      console.log(response.data) 
      if (response.data.success) {
        router.push('/')
      } else {
        console.error('API request failed:', response.data.message)
        // Handle the error, maybe show a message to the user
      }
    } catch (error) {
      console.error('Error during login:', error)
    }
  };

  return (
    <div className="container mx-auto p-4">
     ...Loading
    </div>
  );
};

export default Page;

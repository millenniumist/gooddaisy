"use client";

import liff from "@line/liff";
import React, { useEffect, useState } from "react";
import { useMainStorage } from "@/store/mainStorage";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { user, setUser, setToken, setIsLoggedIn } = useMainStorage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID,
      })
      .then(() => {
        handleLogin();
      })
      .catch((error) => {
        console.error("LIFF initialization failed:", error);
        setLoading(false);
      });
  }, []);

  const handleLogin = async () => {
    try {
      const userProfile = await liff.getProfile();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/line/`, { userProfile,  userDefaultPassword: process.env.NEXT_PUBLIC_USER_DEFAULT_PASSWORD});
      setUser(response.data.user);
      setToken(response.data.token);
      setIsLoggedIn(true);
      if (response.data.success) {
        window.location.href = "/"
      } else {
        console.error('API request failed:', response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      {loading ? (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold">Logging in with LINE...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Login failed. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;

"use client"; // Required to make components interactive

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import crypto from "crypto";
import axios from "axios";
import liff from '@line/liff';
import { useMainStorage } from "@/store/mainStorage";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [state, setState] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const { setToken, token, setUser } = useMainStorage()

  useEffect(() => {
    liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID,
    })
  }, [])

  const hdlLineLogin = () => {
    try {
      if (liff.isInClient()) {
        liff.getProfile().then((profile) => {
        }).catch((err) => {
          console.log('Error getting profile', err);
        });
      } else {
        // Running in external browser
        liff.login();
      }
    } catch (error) {
      console.log(error) 
    }
  }

  const generateRandomState = () => {
    const buffer = crypto.randomBytes(32);
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/login`, {
        username,
        password
      });
      console.log(res.data.newUser);
      setToken(res.data.token)
      setUser(res.data.newUser)
      if (res.data.token) {
        router.push('/');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full bg-[#06c755] hover:bg-[#05a647]" type="button" onClick={hdlLineLogin}>
            Line Authentication
          </Button>
        </CardFooter>
        <CardFooter>
          <Link href="login/admin" className="text-xs font-thin">Admin login here</Link> 
          </CardFooter>
      </Card>
    </main>
  );
}
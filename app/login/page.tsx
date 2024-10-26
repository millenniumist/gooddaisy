"use client"; // Required to make components interactive

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import liff from '@line/liff';
import { useMainStorage } from "@/store/mainStorage";
import Link from "next/link";

export default function Home() {

  useEffect(() => {
    liff.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID,
    })
  }, [])

  const hdlLineLogin = () => {
    try {
    //console.log('hdlLineLogin')
      if (liff.isInClient()) {
        liff.getProfile().then((profile) => {
        }).catch((err) => {
          //console.log('Error getting profile', err);
        });
      } else {
        // Running in external browser
        liff.login();
      }
    } catch (error) {
      //console.log(error) 
    }
  }



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
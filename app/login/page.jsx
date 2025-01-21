"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const handleLogin = async () => {
    try {
      await signIn("line", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
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
          <Button 
            className="w-full bg-[#06c755] hover:bg-[#05a647]" 
            type="button" 
            onClick={handleLogin}
          >
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

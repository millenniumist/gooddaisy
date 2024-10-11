"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useMainStorage } from "@/store/mainStorage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function AdminLoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { setToken, setUser, setUserAdmin, setIsLoggedIn } = useMainStorage()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/login`, {
        username,
        password
      })
      setToken(res.data.token)
      document.cookie = `token=${res.data.token}`
      setUser(res.data.newUser)
      setUserAdmin(true)
      setIsLoggedIn(true)
      if (res.data.token) {
        router.push('/')
      }
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">Login</Button>
      </CardFooter>
    </form>
  )
}

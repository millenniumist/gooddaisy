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
  const { setToken, setUser, setIsAdmin, setIsLoggedIn } = useMainStorage()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}api/login`, {
        username,
        password
      }, {
        headers: {
          'X-App-Secret': process.env.NEXT_PUBLIC_USER_DEFAULT_PASSWORD,
          'X-App-Origin': 'admin-frontend'
        }
      })
      
      setToken(res.data.token)
      setUser(res.data.newUser)
      setIsAdmin(true)
      setIsLoggedIn(true)
      window.location.href = "/"
      
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

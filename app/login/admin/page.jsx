import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLoginForm from './AdminLoginForm'

export const metadata = {
  title: 'Admin Login',
  description: 'Login page for administrators',
}

export default function AdminLogin() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
        </CardHeader>
        <AdminLoginForm />
      </Card>
    </main>
  )
}

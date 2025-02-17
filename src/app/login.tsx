"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Lock, Mail, Linkedin } from "lucide-react"

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Login successful", data)
        localStorage.setItem("token", data.token)
        router.push("/dashbord")
      } else {
        console.error("Login failed", data.error)
        alert("Erreur : " + (data.error || "Identifiants incorrects"))
      }
    } catch (error) {
      console.error("Erreur de connexion", error)
    }
  }

  const handleLoginWithLinkedIn = () => {
    // Remplacez par l'URL de votre authentification LinkedIn
    window.location.href = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=VOTRE_CLIENT_ID&redirect_uri=VOTRE_REDIRECT_URI&scope=r_liteprofile%20r_emailaddress"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <div
              className="h-48 md:h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url(/Logo.jpeg)",
                backgroundColor: "#ffffff",
                opacity: 0.9,
              }}
            />
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 md:p-12 bg-white">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome Back</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-gray-50 border border-gray-300 focus:border-[#2c4999] focus:ring-[#2c4999]"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 bg-gray-50 border border-gray-300 focus:border-[#2c4999] focus:ring-[#2c4999]"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#2c4999] hover:bg-[#233a7a] text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Sign In
                </Button>
              </form>

              {/* Additional Login Options */}
              <div className="mt-6 space-y-4">
                <Button
                  onClick={() => alert("Login with Email clicked!")}
                  className="w-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>Login with Email</span>
                </Button>

                <Button
                  onClick={handleLoginWithLinkedIn}
                  className="w-full border border-[#0077b5] text-[#0077b5] bg-white hover:bg-[#f3faff] py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>Login with LinkedIn</span>
                </Button>
              </div>

              
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login

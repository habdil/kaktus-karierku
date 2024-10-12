'use client'

import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function Component() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    if (email === 'admin@gmail.com' && password === '123') {
      toast.success('Login successful!')
      window.location.href = '/admin/dashboard';
    } else {
      toast.error('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="flex h-screen bg-blue-900">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="m-auto w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-black mb-12 text-center text-4xl font-bold">Welcome Back!</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="text-black mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-full bg-gray-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="text-black mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full rounded-full bg-gray-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}

                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-orange-500 px-4 py-3 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
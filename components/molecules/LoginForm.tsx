import React, { useState } from 'react'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import toast from 'react-hot-toast'

export const LoginForm: React.FC = () => {
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
      window.location.href = '/admin/dashboard'
    } else {
      toast.error('Login failed. Please check your credentials.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
      />
      <Input
        type="password"
        id="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Password"
        isPassword
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
      />
      <Button
        type="submit"
        className="w-full rounded-full bg-orange-500 px-4 py-3 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Login
      </Button>
    </form>
  )
}
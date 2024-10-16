import React from 'react'
import Image from 'next/image'
import { LoginForm } from '../molecules/LoginForm'
import { Toaster } from 'react-hot-toast'

export const LoginContainer: React.FC = () => (
  <div className="flex h-screen bg-blue-900">
    <Toaster position="top-center" reverseOrder={false} />
    <div className="m-auto w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="flex justify-center mb-8">
          <Image 
            src="/images/logo.png" 
            alt="Karierku Logo" 
            width={80} 
            height={80}
          />
        </div>
        <h1 className="text-black mb-12 text-center text-4xl font-bold">Welcome Back!</h1>
        <LoginForm />
      </div>
    </div>
  </div>
)
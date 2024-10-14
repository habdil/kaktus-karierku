import React from 'react'

interface ButtonProps {
  type: "button" | "submit" | "reset"
  className: string
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ type, className, children }) => (
    <button type={type} className={className}>
      {children}
    </button>
  )
import React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface InputProps {
  type: string
  id: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  isPassword?: boolean
  showPassword?: boolean
  toggleShowPassword?: () => void
  disabled?: boolean
}

export const Input: React.FC<InputProps> = ({
  type,
  id,
  placeholder,
  value,
  onChange,
  label,
  isPassword = false,
  showPassword,
  toggleShowPassword,
  disabled = false, 
}) => (
  <div className="mb-6">
    <label htmlFor={id} className="text-black mb-2 block text-sm font-medium">
      {label}
    </label>
    <div className="relative">
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        id={id}
        className="w-full rounded-full bg-gray-100 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled} 
      />
      {isPassword && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={toggleShowPassword}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  </div>
)

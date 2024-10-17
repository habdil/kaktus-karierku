// components/atoms/Input.tsx
interface InputProps {
    label: string;
    type: string;
    placeholder: string;
    // Add other necessary props
  }
  
  export const Input: React.FC<InputProps> = ({ label, type, placeholder, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
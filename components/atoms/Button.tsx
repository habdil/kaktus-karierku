// components/atoms/Button.tsx
interface ButtonProps {
  type: "button" | "submit" | "reset";
  className: string; // Ini diperlukan berdasarkan error
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ type, className, children }) => (
  <button type={type} className={className}>
    {children}
  </button>
);
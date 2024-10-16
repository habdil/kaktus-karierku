export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      {children}
    </div>
  )
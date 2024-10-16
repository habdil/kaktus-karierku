import { Sidebar } from '../molecules/Sidebar'
import { HeaderBar } from '../molecules/HeaderBar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 ml-64 p-8">
      <HeaderBar title={title} />
      {children}
    </div>
  </div>
)
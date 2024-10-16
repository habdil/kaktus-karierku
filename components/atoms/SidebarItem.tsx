import Link from 'next/link'
import { IconType } from 'react-icons'

interface SidebarItemProps {
  icon: IconType
  label: string
  href: string
  isActive: boolean
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, isActive }) => (
  <Link href={href} className={`flex items-center p-2 rounded-lg ${isActive ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
    <Icon className="w-6 h-6 mr-2" />
    <span>{label}</span>
  </Link>
)
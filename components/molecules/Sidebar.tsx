import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiPieChart, FiCalendar, FiUserPlus } from 'react-icons/fi';

const SidebarItem = ({ icon: Icon, label, href, isActive }: { icon: React.ElementType, label: string, href: string, isActive: boolean }) => (
  <Link href={href} className={`flex items-center p-2 rounded-lg ${isActive ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
    <Icon className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </Link>
);

export const Sidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { icon: FiGrid, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FiPieChart, label: 'Analytics', href: '/admin/analytics' },
    { icon: FiCalendar, label: 'Add Event', href: '/admin/addEvents' },
    { icon: FiUserPlus, label: 'Add Mentor', href: '/admin/add-mentor' },
  ];

  return (
    <div className="bg-white h-full w-64 fixed left-0 top-0 overflow-y-auto shadow-lg">
      <div className="p-4 flex justify-center">
        <Image src="/images/logo.png" alt="KarierKu Logo" width={60} height={60} />
      </div>
      <nav className="mt-8 px-4">
        <div className="mb-6">
          <SidebarItem
            icon={menuItems[0].icon}
            label={menuItems[0].label}
            href={menuItems[0].href}
            isActive={pathname === menuItems[0].href}
          />
        </div>
        <div className="text-sm text-gray-500 mt-4 mb-2 px-2">Others</div>
        {menuItems.slice(1).map((item) => (
          <div key={item.href} className="mt-2">
            <SidebarItem
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          </div>
        ))}
      </nav>
    </div>
  );
};
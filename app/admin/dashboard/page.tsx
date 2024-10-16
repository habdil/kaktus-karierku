'use client';

import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { Card } from '@/components/atoms/Card';
import { FiUsers, FiCalendar, FiBookOpen } from 'react-icons/fi';

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string }) => (
  <Card>
    <div className="flex items-center">
      <Icon className="text-blue-500 w-8 h-8 mr-3" />
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

const DashboardAdminPage = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard icon={FiUsers} title="Total Users" value="1,234" />
        <StatCard icon={FiCalendar} title="Upcoming Events" value="5" />
        <StatCard icon={FiBookOpen} title="Active Mentors" value="23" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-black">Recent Activities</h2>
          <ul className="space-y-2 text-black">
            <li>New user registered: John Doe</li>
            <li>Event created: Career Fair 2024</li>
            <li>Mentor added: Jane Smith</li>
          </ul>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-black">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Add New Event
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Invite Mentor
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DashboardAdminPage;
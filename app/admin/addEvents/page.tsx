// /admin/addEvents/page.tsx
'use client';

import { DashboardLayout } from '@/components/organisms/DashboardLayout';
import { AddEventForm } from '@/components/molecules/AddEventForm';
import { Card } from '@/components/atoms/Card';
import { EventHistoryItem } from '@/components/molecules/EventHistoryItem';

const AddEventPage = () => {
  return (
    <DashboardLayout title="Add Event">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <AddEventForm />
        </Card>
        <Card>
          <h2 className="text-xl font-semibold mb-4">History</h2>
          <EventHistoryItem 
            title="Personal Branding to Propel Your Career Forward!"
            image="/path-to-event-image.jpg"
          />
          {/* Add more EventHistoryItems as needed */}
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AddEventPage;
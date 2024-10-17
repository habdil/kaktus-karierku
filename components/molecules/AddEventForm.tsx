// components/molecules/AddEventForm.tsx
import React from 'react';
import { Input } from '../atoms/Input-addEvent';
import { Button } from '../atoms/Button';

export const AddEventForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Event Title" type="text" placeholder="Enter event title" />
      <Input label="Date" type="date" placeholder="Select date" />
      <Input label="Location" type="text" placeholder="Enter location" />
      <Input label="Description" type="textarea" placeholder="Enter event description" />
      <Button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Add Event
      </Button>
    </form>
  );
};
// components/molecules/EventHistoryItem.tsx
import Image from 'next/image';

interface EventHistoryItemProps {
  title: string;
  image: string;
}

export const EventHistoryItem: React.FC<EventHistoryItemProps> = ({ title, image }) => (
  <div className="flex items-center space-x-4 mb-4">
    <Image src={image} alt={title} width={100} height={100} className="rounded-md" />
    <div>
      <h3 className="font-semibold">{title}</h3>
      {/* Add more event details as needed */}
    </div>
  </div>
);
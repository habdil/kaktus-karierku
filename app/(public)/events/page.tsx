// app\(public)\events\page.tsx

"use client";

import { useState } from "react";
import { PublicEventList } from "@/components/public/PublicEventList";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto py-8">
      <PublicEventList searchQuery={searchQuery} onSearchChange={handleSearchChange} />
    </div>
  );
}

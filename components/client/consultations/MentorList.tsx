// components/client/MentorList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Briefcase, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Mentor {
  id: string;
  fullName: string;
  education: string;
  company: string;
  jobRole: string;
  motivation: string | null;
  averageRating: number | null;
  totalRatings: number;
  availableSlotsCount: number;
}

interface PaginationInfo {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

const SPECIALTY_OPTIONS = [
  { value: "all", label: "All Specialties" },
  { value: "software-engineer", label: "Software Engineer" },
  { value: "product-manager", label: "Product Manager" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "ux-designer", label: "UX Designer" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "digital-marketing", label: "Digital Marketing" }
] as const;

const ITEMS_PER_PAGE = 9; // Menampilkan 9 item per halaman untuk grid 3x3

export default function MentorList() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState<string>("all");

  const fetchMentors = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(search && { search }),
        ...(specialty !== "all" && { 
          specialty: SPECIALTY_OPTIONS.find(opt => opt.value === specialty)?.label || '' 
        }),
      });

      const response = await fetch(`/api/client/consultations/mentors?${params}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please login again to continue.",
            variant: "destructive",
          });
          router.push('/login');
          return;
        }
        throw new Error(data.error);
      }

      setMentors(data.mentors);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch mentors. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMentors();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, specialty]);

  const RatingStars = ({ rating }: { rating: number | null }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              (rating || 0) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleMentorClick = (mentorId: string) => {
    router.push(`/dashboard/consultation/${mentorId}`);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Find Your Mentor</h2>
        <p className="text-muted-foreground mt-2">
          Connect with experienced professionals who can guide your career journey
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 md:flex md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name, role, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Choose specialty" />
          </SelectTrigger>
          <SelectContent>
            {SPECIALTY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-48 bg-gray-200" />
              <CardContent className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {mentors.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-semibold text-gray-900">No mentors found</p>
                <p className="text-gray-500">Try adjusting your search or filter</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <Card 
                  key={mentor.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleMentorClick(mentor.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10">
                          {mentor.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {mentor.fullName}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Briefcase className="mr-1 h-4 w-4" />
                          {mentor.jobRole}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <RatingStars rating={mentor.averageRating} />
                        <span className="text-sm text-gray-500">
                          ({mentor.totalRatings})
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {mentor.availableSlotsCount} slots available
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      {mentor.company}
                    </div>
                    {mentor.motivation && (
                      <p className="text-sm line-clamp-3 text-gray-600">
                        {mentor.motivation}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => fetchMentors(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          {[...Array(pagination.pages)].map((_, i) => {
            const pageNumber = i + 1;
            // Show first page, last page, current page, and pages around current page
            if (
              pageNumber === 1 ||
              pageNumber === pagination.pages ||
              Math.abs(pageNumber - pagination.currentPage) <= 1
            ) {
              return (
                <Button
                  key={pageNumber}
                  variant={pagination.currentPage === pageNumber ? 'default' : 'outline'}
                  onClick={() => fetchMentors(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            }
            // Show dots if there's a gap
            if (Math.abs(pageNumber - pagination.currentPage) === 2) {
              return <span key={pageNumber} className="px-3 py-2">...</span>;
            }
            return null;
          })}
          <Button
            variant="outline"
            onClick={() => fetchMentors(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  BarChart as ReBarChart,
  Bar,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CareerStatusData, RegistrationData, ConsultationStats, EventParticipation } from "@/lib/types/analytics";
import { PieChart, TrendingDown, BarChart, Users, Ban } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EmptyState = ({ 
  icon: Icon, 
  message 
}: { 
  icon: React.ElementType; 
  message: string 
}) => (
  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
    <div className="relative">
      <Icon className="h-12 w-12 mb-4 text-muted-foreground/50" />
      <Ban className="h-8 w-8 absolute -top-1 -right-1 text-muted-foreground/30" />
    </div>
    <p className="text-sm">{message}</p>
  </div>
);

interface CareerStatusChartProps {
  data: CareerStatusData[];
}

export function CareerStatusChart({ data }: CareerStatusChartProps) {
  const hasData = data && data.length > 0 && data.some(item => item.count > 0);

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Career Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={(entry) => `${entry.status}: ${entry.count}`}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            icon={PieChart} 
            message="No career status data available" 
          />
        )}
      </CardContent>
    </Card>
  );
}

interface RegistrationChartProps {
  data: RegistrationData[];
}

export function RegistrationChart({ data }: RegistrationChartProps) {
  const hasData = data && data.length > 0 && data.some(item => item.count > 0);
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short' })
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  name="Registrations"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            icon={TrendingDown} 
            message="No registration data available" 
          />
        )}
      </CardContent>
    </Card>
  );
}

interface ConsultationChartProps {
  data: ConsultationStats[];
}

export function ConsultationChart({ data }: ConsultationChartProps) {
  const hasData = data && data.length > 0 && data.some(item => item._count.id > 0);
  const formattedData = data.map(item => ({
    status: item.status,
    count: item._count.id
  }));

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Consultation Status</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={formattedData}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="#8884d8" 
                  name="Consultations"
                  radius={[4, 4, 0, 0]}
                />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            icon={BarChart} 
            message="No consultation data available" 
          />
        )}
      </CardContent>
    </Card>
  );
}

interface EventParticipationTableProps {
  data: EventParticipation[];
}

export function EventParticipationTable({ data }: EventParticipationTableProps) {
  const hasData = data && data.length > 0 && data.some(item => item._count.id > 0);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Event Participation</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead className="text-right">Participants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((event) => (
                <TableRow key={event.eventId}>
                  <TableCell>{event.eventId}</TableCell>
                  <TableCell className="text-right">{event._count.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState 
            icon={Users} 
            message="No event participation data available" 
          />
        )}
      </CardContent>
    </Card>
  );
}
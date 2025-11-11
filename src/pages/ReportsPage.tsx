import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/useApi";
import { ReportSummary } from "@shared/types";
import { format } from "date-fns";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from "lucide-react";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${payload.name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};
export function ReportsPage() {
  const { data, isLoading, error } = useApi<ReportSummary>(['reports', 'summary']);
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-destructive py-12">
          <p>Failed to load reports: {error.message}</p>
        </div>
      );
    }
    if (!data) {
      return <div className="text-center text-muted-foreground py-12">No data available for reports.</div>;
    }
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Status Distribution</CardTitle>
            <CardDescription>Overview of all keys in the inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Keys Issued by Department</CardTitle>
            <CardDescription>Number of active key assignments per department.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.departmentActivity} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="keys" fill="#8884d8" name="Keys Issued" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Overdue Keys Report
            </CardTitle>
            <CardDescription>All keys that have passed their due date.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Number</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.overdueKeys.length > 0 ? (
                    data.overdueKeys.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.keyNumber}</TableCell>
                        <TableCell>{item.personName}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell className="text-destructive font-semibold">
                          {format(new Date(item.dueDate), "MMM dd, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No overdue keys. Great job!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <PageHeader
            title="Reports"
            subtitle="Analyze key inventory and assignment data."
          />
          {renderContent()}
        </div>
      </div>
    </AppLayout>
  );
}
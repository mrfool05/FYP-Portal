import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Users, FileText, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockGroups, mockSubmissions, mockSupervisionRequests } from '@/data/mockData';

export default function SupervisorDashboard() {
  const pendingRequests = mockSupervisionRequests.filter(r => r.status === 'pending').length;
  const assignedGroups = mockGroups.length;
  const pendingReviews = mockSubmissions.filter(s => s.status === 'uploaded').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor Dashboard"
        description="Manage your supervision requests, groups, and reviews"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Assigned Groups" value={assignedGroups} icon={Users} description="Active groups" />
        <StatsCard title="Pending Requests" value={pendingRequests} icon={Clock} description="Awaiting response" />
        <StatsCard title="Pending Reviews" value={pendingReviews} icon={FileText} description="Documents to review" />
        <StatsCard title="Completed Evaluations" value={2} icon={CheckCircle} description="This semester" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Supervision Requests</CardTitle>
              <CardDescription>Students requesting your supervision</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/supervisor/requests">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSupervisionRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{request.group?.name || 'Group'}</p>
                    <p className="text-sm text-muted-foreground">Requested: {new Date(request.requestedAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">My Groups</CardTitle>
              <CardDescription>Groups under your supervision</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/supervisor/groups">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGroups.slice(0, 3).map((group) => (
                <div key={group.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{group.members.length} members</p>
                  </div>
                  <Badge variant="secondary">active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

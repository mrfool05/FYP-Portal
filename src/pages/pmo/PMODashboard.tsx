import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatsCard } from '@/components/shared/StatsCard';
import { FolderGit2, Users, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProjects, mockStudents, mockSupervisors } from '@/data/mockData';

export default function PMODashboard() {
  const totalProjects = mockProjects.length;
  const pendingApprovals = mockProjects.filter(p => p.status === 'submitted').length;
  const activeGroups = mockProjects.filter(p => p.status === 'approved').length; // Mock logic
  const completedProjects = 0; // Mock

  return (
    <div className="space-y-6">
      <PageHeader
        title="PMO Dashboard"
        description="Department overview and project management"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Projects" value={totalProjects} icon={FolderGit2} description="All sessions" />
        <StatsCard title="Pending Approvals" value={pendingApprovals} icon={FileCheck} description="Needs review" />
        <StatsCard title="Active Groups" value={activeGroups} icon={Users} description="Currently active" />
        <StatsCard title="Completed" value={completedProjects} icon={CheckCircle2} description="Successfully finished" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/pmo/approvals">
                <FileCheck className="mr-2 h-4 w-4" />
                Review Project Proposals
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/pmo/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">New project proposal submitted</p>
                  <p className="text-xs text-muted-foreground">Team Alpha - AI Prediction</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Mid-term evaluation completed</p>
                  <p className="text-xs text-muted-foreground">3 groups evaluated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

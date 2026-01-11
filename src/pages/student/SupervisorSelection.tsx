import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockSupervisors, mockSupervisionRequests } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, UserCheck, Users, BookOpen, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SupervisorSelection() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get existing request for current user's group
  const existingRequest = mockSupervisionRequests.find(r => r.groupId === 'group-1');

  // Get all unique expertise areas
  const allExpertise = [...new Set(mockSupervisors.flatMap(s => s.expertise))];

  // Filter supervisors
  const filteredSupervisors = mockSupervisors.filter(supervisor => {
    const matchesSearch = supervisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supervisor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesExpertise = !selectedExpertise || supervisor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

  const handleRequestClick = (supervisorId: string) => {
    setSelectedSupervisor(supervisorId);
    setDialogOpen(true);
  };

  const handleSubmitRequest = () => {
    toast.success('Supervision request sent successfully!');
    setDialogOpen(false);
    setRequestMessage('');
  };

  const selectedSupervisorData = mockSupervisors.find(s => s.id === selectedSupervisor);

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <PageHeader
        title="Supervisor Selection"
        description="Find and request a supervisor for your project"
      />

      {/* Current Request Status */}
      {existingRequest && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Request Status</p>
                <p className="text-sm text-muted-foreground">
                  You've requested {mockSupervisors.find(s => s.id === existingRequest.supervisorId)?.name}
                </p>
              </div>
            </div>
            <StatusBadge status={existingRequest.status} />
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedExpertise === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedExpertise(null)}
          >
            All
          </Button>
          {allExpertise.slice(0, 4).map((expertise) => (
            <Button
              key={expertise}
              variant={selectedExpertise === expertise ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedExpertise(expertise)}
            >
              {expertise}
            </Button>
          ))}
        </div>
      </div>

      {/* Supervisor Cards */}
      {filteredSupervisors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSupervisors.map((supervisor) => {
            const isAvailable = supervisor.currentGroups < supervisor.maxGroups;
            const availableSlots = supervisor.maxGroups - supervisor.currentGroups;

            return (
              <Card key={supervisor.id} className="card-interactive">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{supervisor.name}</CardTitle>
                      <CardDescription>{supervisor.designation}</CardDescription>
                    </div>
                    <Badge variant={isAvailable ? 'default' : 'secondary'}>
                      {isAvailable ? `${availableSlots} slots` : 'Full'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {supervisor.expertise.map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {supervisor.currentGroups}/{supervisor.maxGroups} groups
                    </span>
                    <Button
                      size="sm"
                      disabled={!isAvailable || !!existingRequest}
                      onClick={() => handleRequestClick(supervisor.id)}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={UserCheck}
          title="No supervisors found"
          description="Try adjusting your search or filters"
        />
      )}

      {/* Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Supervision</DialogTitle>
            <DialogDescription>
              Send a supervision request to {selectedSupervisorData?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you'd like this supervisor..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

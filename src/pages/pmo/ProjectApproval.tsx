import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, FileText, Search, Filter } from 'lucide-react';
import { mockProjects, mockGroups } from '@/data/mockData';
import { toast } from 'sonner';

export default function ProjectApproval() {
    const [projects, setProjects] = useState(mockProjects.filter(p => p.status === 'submitted' || p.status === 'approved'));
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const pendingProjects = projects.filter(p => p.status === 'submitted');

    const handleApprove = (projectId: string) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'approved' as const } : p));
        toast.success('Project approved successfully');
    };

    const handleRejectClick = (project: any) => {
        setSelectedProject(project);
        setRejectDialogOpen(true);
    };

    const confirmReject = () => {
        if (!selectedProject) return;
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, status: 'rejected' as const, rejectionReason } : p));
        toast.error('Project rejected');
        setRejectDialogOpen(false);
        setRejectionReason('');
        setSelectedProject(null);
    };

    const getGroupName = (groupId: string) => mockGroups.find(g => g.id === groupId)?.name || 'Unknown Group';

    return (
        <div className="space-y-6">
            <PageHeader title="Project Approval" description="Review and approve project ideas submitted by student groups" />

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search projects..." className="pl-10" />
                </div>
                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
            </div>

            <div className="grid gap-4">
                {pendingProjects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No pending project proposals found.</div>
                ) : (
                    pendingProjects.map(project => (
                        <Card key={project.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{project.title}</CardTitle>
                                        <CardDescription>{getGroupName(project.groupId)} • {project.domain}</CardDescription>
                                    </div>
                                    <StatusBadge status={project.status} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="bg-muted p-4 rounded-md">
                                        <p className="text-sm">{project.abstract}</p>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleRejectClick(project)}>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                        <Button onClick={() => handleApprove(project.id)}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Project Proposal</DialogTitle>
                        <DialogDescription>Please provide a reason for rejecting this proposal.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="reason">Rejection Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="e.g., Scope is too small, Topic not relevant..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmReject}>Reject Proposal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

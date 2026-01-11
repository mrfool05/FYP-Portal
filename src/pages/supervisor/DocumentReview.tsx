import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, StatusType } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Download, CheckCircle, XCircle, Eye, Clock, Calendar, Users } from 'lucide-react';
import { mockSubmissions } from '@/data/mockData';
import { Submission, DocumentStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function DocumentReview() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [feedback, setFeedback] = useState('');

  const pendingSubmissions = submissions.filter(s => s.status === 'uploaded');
  const reviewedSubmissions = submissions.filter(s => s.status === 'approved' || s.status === 'rejected');

  const handleAction = (submission: Submission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setActionType(action);
    setFeedback('');
  };

  const confirmAction = () => {
    if (!selectedSubmission || !actionType) return;
    const newStatus: DocumentStatus = actionType === 'approve' ? 'approved' : 'rejected';
    setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, status: newStatus, feedback } : s));
    toast({ title: actionType === 'approve' ? 'Document Approved' : 'Document Rejected' });
    setSelectedSubmission(null);
    setActionType(null);
  };

  const SubmissionCard = ({ submission }: { submission: Submission }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
              <div>
                <h4 className="font-semibold">{submission.title}</h4>
                <p className="text-sm text-muted-foreground">Version {submission.version} • {submission.milestoneType}</p>
              </div>
            </div>
            <StatusBadge status={submission.status as StatusType} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{submission.groupId}</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(submission.submittedAt).toLocaleDateString()}</span>
            <Badge variant="outline">{submission.milestoneType}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Preview</Button>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Download</Button>
            {submission.status === 'uploaded' && (
              <>
                <Button size="sm" onClick={() => handleAction(submission, 'approve')}><CheckCircle className="mr-2 h-4 w-4" />Approve</Button>
                <Button variant="destructive" size="sm" onClick={() => handleAction(submission, 'reject')}><XCircle className="mr-2 h-4 w-4" />Reject</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Document Review" description="Review submitted documents from your supervised groups" />
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {pendingSubmissions.length} Pending</Badge>
        <Badge variant="outline" className="gap-1 text-status-approved"><CheckCircle className="h-3 w-3" /> {reviewedSubmissions.filter(s => s.status === 'approved').length} Approved</Badge>
      </div>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList><TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger><TabsTrigger value="reviewed">Reviewed ({reviewedSubmissions.length})</TabsTrigger></TabsList>
        <TabsContent value="pending"><div className="grid gap-4 md:grid-cols-2">{pendingSubmissions.map(s => <SubmissionCard key={s.id} submission={s} />)}</div></TabsContent>
        <TabsContent value="reviewed"><div className="grid gap-4 md:grid-cols-2">{reviewedSubmissions.map(s => <SubmissionCard key={s.id} submission={s} />)}</div></TabsContent>
      </Tabs>
      <Dialog open={!!selectedSubmission && !!actionType} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{actionType === 'approve' ? 'Approve' : 'Reject'} Document</DialogTitle><DialogDescription>Confirm your action.</DialogDescription></DialogHeader>
          <div className="space-y-4"><Label htmlFor="feedback">Feedback</Label><Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setSelectedSubmission(null)}>Cancel</Button><Button variant={actionType === 'reject' ? 'destructive' : 'default'} onClick={confirmAction}>{actionType === 'approve' ? 'Approve' : 'Reject'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

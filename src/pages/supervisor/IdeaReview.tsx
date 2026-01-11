import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, StatusType } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lightbulb, CheckCircle, XCircle, MessageSquare, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type IdeaStatus = 'pending' | 'approved' | 'rejected';

interface ProjectIdea {
  id: string;
  groupName: string;
  title: string;
  domain: string;
  abstract: string;
  status: IdeaStatus;
  submittedAt: string;
  feedback?: string;
}

const mockIdeas: ProjectIdea[] = [
  { id: '1', groupName: 'Team Alpha', title: 'AI-Powered Campus Navigation', domain: 'AI', abstract: 'An intelligent navigation system for campus.', status: 'pending', submittedAt: '2024-01-15T10:00:00Z' },
  { id: '2', groupName: 'Code Wizards', title: 'Blockchain Credentials', domain: 'Blockchain', abstract: 'Decentralized credential verification.', status: 'approved', submittedAt: '2024-01-10T14:30:00Z', feedback: 'Great concept!' },
];

export default function IdeaReview() {
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<ProjectIdea[]>(mockIdeas);
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [feedback, setFeedback] = useState('');

  const pendingIdeas = ideas.filter(i => i.status === 'pending');
  const reviewedIdeas = ideas.filter(i => i.status !== 'pending');

  const confirmAction = () => {
    if (!selectedIdea || !actionType) return;
    setIdeas(prev => prev.map(i => i.id === selectedIdea.id ? { ...i, status: actionType === 'approve' ? 'approved' : 'rejected', feedback } : i));
    toast({ title: actionType === 'approve' ? 'Idea Approved' : 'Idea Rejected' });
    setSelectedIdea(null);
    setActionType(null);
  };

  const IdeaCard = ({ idea }: { idea: ProjectIdea }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">{idea.title}<StatusBadge status={idea.status as StatusType} /></CardTitle>
            <CardDescription className="flex items-center gap-4"><span className="flex items-center gap-1"><Users className="h-3 w-3" /> {idea.groupName}</span><span className="flex items-center gap-1"><Lightbulb className="h-3 w-3" /> {idea.domain}</span></CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{idea.abstract}</p>
        {idea.feedback && <div className="p-3 rounded-lg bg-muted/50 border"><p className="text-sm">{idea.feedback}</p></div>}
        {idea.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button onClick={() => { setSelectedIdea(idea); setActionType('approve'); setFeedback(''); }}><CheckCircle className="mr-2 h-4 w-4" />Approve</Button>
            <Button variant="destructive" onClick={() => { setSelectedIdea(idea); setActionType('reject'); setFeedback(''); }}><XCircle className="mr-2 h-4 w-4" />Reject</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Idea Review" description="Review project ideas from your supervised groups" />
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList><TabsTrigger value="pending">Pending ({pendingIdeas.length})</TabsTrigger><TabsTrigger value="reviewed">Reviewed ({reviewedIdeas.length})</TabsTrigger></TabsList>
        <TabsContent value="pending" className="space-y-4">{pendingIdeas.map(idea => <IdeaCard key={idea.id} idea={idea} />)}</TabsContent>
        <TabsContent value="reviewed" className="space-y-4">{reviewedIdeas.map(idea => <IdeaCard key={idea.id} idea={idea} />)}</TabsContent>
      </Tabs>
      <Dialog open={!!selectedIdea && !!actionType} onOpenChange={() => setSelectedIdea(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{actionType === 'approve' ? 'Approve' : 'Reject'} Idea</DialogTitle><DialogDescription>Confirm your action.</DialogDescription></DialogHeader>
          <div className="space-y-4"><Label htmlFor="feedback">Feedback</Label><Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setSelectedIdea(null)}>Cancel</Button><Button variant={actionType === 'reject' ? 'destructive' : 'default'} onClick={confirmAction}>{actionType === 'approve' ? 'Approve' : 'Reject'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

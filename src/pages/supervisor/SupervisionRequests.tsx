import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mockSupervisionRequests } from '@/data/mockData';
import { SupervisionRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function SupervisionRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<SupervisionRequest[]>(mockSupervisionRequests);
  const [selectedRequest, setSelectedRequest] = useState<SupervisionRequest | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [responseMessage, setResponseMessage] = useState('');

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const handleAction = (request: SupervisionRequest, action: 'accept' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setResponseMessage('');
  };

  const confirmAction = () => {
    if (!selectedRequest || !actionType) return;
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: actionType === 'accept' ? 'accepted' : 'rejected', responseMessage } : r));
    toast({ title: actionType === 'accept' ? 'Request Accepted' : 'Request Rejected' });
    setSelectedRequest(null);
    setActionType(null);
  };

  const RequestCard = ({ request }: { request: SupervisionRequest }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <h4 className="font-semibold">{request.group?.name || 'Student Group'}</h4>
                <p className="text-sm text-muted-foreground">Group ID: {request.groupId}</p>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>
          {request.message && <div className="p-3 rounded-lg bg-muted/50"><p className="text-sm italic">"{request.message}"</p></div>}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{new Date(request.requestedAt).toLocaleDateString()}</span></div>
          </div>
          {request.status === 'pending' && (
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => handleAction(request, 'accept')}><CheckCircle className="mr-2 h-4 w-4" />Accept</Button>
              <Button variant="outline" className="flex-1" onClick={() => handleAction(request, 'reject')}><XCircle className="mr-2 h-4 w-4" />Decline</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Supervision Requests" description="Review and respond to student group supervision requests" />
      <div className="flex gap-4 flex-wrap">
        <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {pendingRequests.length} Pending</Badge>
        <Badge variant="outline" className="gap-1 text-status-approved"><CheckCircle className="h-3 w-3" /> {acceptedRequests.length} Accepted</Badge>
        <Badge variant="outline" className="gap-1 text-status-rejected"><XCircle className="h-3 w-3" /> {rejectedRequests.length} Declined</Badge>
      </div>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Declined ({rejectedRequests.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><div className="grid gap-4 md:grid-cols-2">{pendingRequests.map(r => <RequestCard key={r.id} request={r} />)}</div></TabsContent>
        <TabsContent value="accepted"><div className="grid gap-4 md:grid-cols-2">{acceptedRequests.map(r => <RequestCard key={r.id} request={r} />)}</div></TabsContent>
        <TabsContent value="rejected"><div className="grid gap-4 md:grid-cols-2">{rejectedRequests.map(r => <RequestCard key={r.id} request={r} />)}</div></TabsContent>
      </Tabs>
      <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === 'accept' ? 'Accept' : 'Decline'} Request</DialogTitle>
            <DialogDescription>Confirm your action for this supervision request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Message (Optional)</Label>
              <Textarea id="response" value={responseMessage} onChange={(e) => setResponseMessage(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
            <Button variant={actionType === 'accept' ? 'default' : 'destructive'} onClick={confirmAction}>{actionType === 'accept' ? 'Accept' : 'Decline'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

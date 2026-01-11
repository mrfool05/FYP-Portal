import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, StatusType } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, Calendar, Save, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GroupEvaluation {
  groupId: string;
  groupName: string;
  projectTitle: string;
  status: 'pending' | 'submitted';
  marks?: { documentation: number; implementation: number; presentation: number; viva: number };
  feedback?: string;
}

const mockEvaluations: GroupEvaluation[] = [
  { groupId: 'g1', groupName: 'Team Alpha', projectTitle: 'AI Navigation', status: 'pending' },
  { groupId: 'g2', groupName: 'Code Wizards', projectTitle: 'Blockchain Credentials', status: 'submitted', marks: { documentation: 18, implementation: 17, presentation: 16, viva: 15 }, feedback: 'Good work!' },
];

export default function SupervisorEvaluation() {
  const { toast } = useToast();
  const [evaluations, setEvaluations] = useState<GroupEvaluation[]>(mockEvaluations);
  const [selectedEval, setSelectedEval] = useState<GroupEvaluation | null>(null);
  const [marks, setMarks] = useState({ documentation: 0, implementation: 0, presentation: 0, viva: 0 });
  const [feedback, setFeedback] = useState('');

  const pending = evaluations.filter(e => e.status === 'pending');
  const submitted = evaluations.filter(e => e.status === 'submitted');

  const handleSubmit = () => {
    if (!selectedEval) return;
    setEvaluations(prev => prev.map(e => e.groupId === selectedEval.groupId ? { ...e, status: 'submitted' as const, marks, feedback } : e));
    toast({ title: 'Evaluation Submitted' });
    setSelectedEval(null);
  };

  const EvalCard = ({ evaluation }: { evaluation: GroupEvaluation }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10"><Award className="h-5 w-5 text-primary" /></div>
              <div><h4 className="font-semibold">{evaluation.groupName}</h4><p className="text-sm text-muted-foreground">{evaluation.projectTitle}</p></div>
            </div>
            <StatusBadge status={evaluation.status as StatusType} />
          </div>
          {evaluation.marks && (
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold">{evaluation.marks.documentation}</p><p className="text-xs text-muted-foreground">Docs</p></div>
              <div className="p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold">{evaluation.marks.implementation}</p><p className="text-xs text-muted-foreground">Impl</p></div>
              <div className="p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold">{evaluation.marks.presentation}</p><p className="text-xs text-muted-foreground">Pres</p></div>
              <div className="p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold">{evaluation.marks.viva}</p><p className="text-xs text-muted-foreground">Viva</p></div>
              <div className="p-2 rounded-lg bg-primary/10"><p className="text-lg font-bold text-primary">{evaluation.marks.documentation + evaluation.marks.implementation + evaluation.marks.presentation + evaluation.marks.viva}</p><p className="text-xs">Total</p></div>
            </div>
          )}
          <Button variant={evaluation.status === 'pending' ? 'default' : 'outline'} onClick={() => { setSelectedEval(evaluation); setMarks(evaluation.marks || { documentation: 0, implementation: 0, presentation: 0, viva: 0 }); setFeedback(evaluation.feedback || ''); }}>
            {evaluation.status === 'pending' ? 'Start Evaluation' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Evaluation" description="Submit evaluation marks for your supervised groups" />
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList><TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger><TabsTrigger value="submitted">Submitted ({submitted.length})</TabsTrigger></TabsList>
        <TabsContent value="pending"><div className="grid gap-4 md:grid-cols-2">{pending.map(e => <EvalCard key={e.groupId} evaluation={e} />)}</div></TabsContent>
        <TabsContent value="submitted"><div className="grid gap-4 md:grid-cols-2">{submitted.map(e => <EvalCard key={e.groupId} evaluation={e} />)}</div></TabsContent>
      </Tabs>
      <Dialog open={!!selectedEval} onOpenChange={() => setSelectedEval(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{selectedEval?.status === 'pending' ? 'Submit Evaluation' : 'View Evaluation'}</DialogTitle><DialogDescription>{selectedEval?.groupName} - {selectedEval?.projectTitle}</DialogDescription></DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {['documentation', 'implementation', 'presentation', 'viva'].map(field => (
                <div key={field} className="space-y-2"><Label className="capitalize">{field} (/20)</Label><Input type="number" min={0} max={20} value={marks[field as keyof typeof marks]} onChange={(e) => setMarks(prev => ({ ...prev, [field]: Math.min(20, parseInt(e.target.value) || 0) }))} disabled={selectedEval?.status !== 'pending'} /></div>
              ))}
            </div>
            <div className="p-4 rounded-lg bg-primary/10"><div className="flex justify-between"><span>Total</span><span className="text-2xl font-bold text-primary">{marks.documentation + marks.implementation + marks.presentation + marks.viva} / 80</span></div></div>
            <div><Label>Feedback</Label><Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} disabled={selectedEval?.status !== 'pending'} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSelectedEval(null)}>Close</Button>{selectedEval?.status === 'pending' && <Button onClick={handleSubmit}><Save className="mr-2 h-4 w-4" />Submit</Button>}</DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

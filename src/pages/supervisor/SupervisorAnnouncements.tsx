import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Megaphone, Plus, Calendar, Users, Edit, Trash2 } from 'lucide-react';
import { mockGroups } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface LocalAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  targetGroup: string;
  createdAt: string;
}

export default function SupervisorAnnouncements() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<LocalAnnouncement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetGroup, setTargetGroup] = useState<string>('all');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    const newAnn: LocalAnnouncement = { id: `ann-${Date.now()}`, title, content, priority, targetGroup, createdAt: new Date().toISOString() };
    setAnnouncements(prev => [newAnn, ...prev]);
    toast({ title: 'Announcement Published' });
    setIsDialogOpen(false);
    setTitle(''); setContent('');
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Announcement Deleted' });
  };

  const getPriorityColor = (p: string) => {
    switch (p) { case 'high': return 'bg-destructive/10 text-destructive'; case 'low': return 'bg-muted text-muted-foreground'; default: return 'bg-primary/10 text-primary'; }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Create announcements for your supervised groups">
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />New Announcement</Button>
      </PageHeader>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center justify-center py-12"><Megaphone className="h-12 w-12 text-muted-foreground/50 mb-4" /><p className="text-muted-foreground mb-4">No announcements yet</p><Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Announcement</Button></CardContent></Card>
        ) : (
          announcements.map(ann => (
            <Card key={ann.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div><CardTitle className="text-lg flex items-center gap-2">{ann.title}<Badge className={getPriorityColor(ann.priority)}>{ann.priority}</Badge></CardTitle><CardDescription className="flex items-center gap-4"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(ann.createdAt).toLocaleDateString()}</span><span className="flex items-center gap-1"><Users className="h-3 w-3" />{ann.targetGroup === 'all' ? 'All groups' : ann.targetGroup}</span></CardDescription></div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(ann.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{ann.content}</p></CardContent>
            </Card>
          ))
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Announcement</DialogTitle><DialogDescription>Create a new announcement for your groups.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><Label>Content *</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Target</Label><Select value={targetGroup} onValueChange={setTargetGroup}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Groups</SelectItem>{mockGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Priority</Label><Select value={priority} onValueChange={(v: 'low' | 'medium' | 'high') => setPriority(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>Publish</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

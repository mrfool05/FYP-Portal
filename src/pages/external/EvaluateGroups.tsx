import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mockGroups } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EvaluateGroups() {
    const [selectedGroup, setSelectedGroup] = useState(mockGroups[0].id);
    const [marks, setMarks] = useState({
        implementation: '',
        presentation: '',
        qa: '',
        report: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Evaluation submitted successfully');
        setMarks({ implementation: '', presentation: '', qa: '', report: '' });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Evaluate Groups" description="Conduct viva and submit marks for assigned groups" />

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Select Group</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {mockGroups.map(g => (
                                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="font-semibold">Project Title</div>
                            <div className="text-muted-foreground">AI Based Traffic Control</div>
                            <div className="font-semibold mt-2">Members</div>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {mockGroups.find(g => g.id === selectedGroup)?.members.map(m => <li key={m.userId}>{m.name}</li>)}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Evaluation Rubric</CardTitle>
                        <CardDescription>Enter marks out of total for each criterion</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Implementation (40)</Label>
                                    <Input type="number" min="0" max="40" value={marks.implementation} onChange={e => setMarks({ ...marks, implementation: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Presentation (20)</Label>
                                    <Input type="number" min="0" max="20" value={marks.presentation} onChange={e => setMarks({ ...marks, presentation: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Q&A / Viva (20)</Label>
                                    <Input type="number" min="0" max="20" value={marks.qa} onChange={e => setMarks({ ...marks, qa: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Report Quality (20)</Label>
                                    <Input type="number" min="0" max="20" value={marks.report} onChange={e => setMarks({ ...marks, report: e.target.value })} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>General Remarks</Label>
                                <Textarea placeholder="Strengths, weaknesses, and improvement areas..." rows={4} />
                            </div>

                            <Button type="submit" className="w-full md:w-auto">Submit Evaluation</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

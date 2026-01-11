import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockGroups, mockSupervisors } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SupervisorAssignment() {
    const [groups, setGroups] = useState(mockGroups);

    const handleAssign = (groupId: string, supervisorId: string) => {
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, supervisorId } : g));
        toast.success('Supervisor assigned successfully');
    };

    const getSupervisorName = (id?: string) => mockSupervisors.find(s => s.id === id)?.name || 'Unassigned';

    return (
        <div className="space-y-6">
            <PageHeader title="Supervisor Assignment" description="Manually assign or reassign supervisors to project groups" />

            <Card>
                <CardHeader>
                    <CardTitle>Group Allocations</CardTitle>
                    <CardDescription>Manage supervisor allocations for all active groups</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Group Name</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Current Supervisor</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groups.map((group) => (
                                <TableRow key={group.id}>
                                    <TableCell className="font-medium">{group.name}</TableCell>
                                    <TableCell>{group.members.length} members</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {group.supervisorId ? <Badge variant="secondary">{getSupervisorName(group.supervisorId)}</Badge> : <Badge variant="outline" className="text-muted-foreground">Unassigned</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 max-w-[200px]">
                                            <Select onValueChange={(val) => handleAssign(group.id, val)} defaultValue={group.supervisorId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Assign Supervisor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mockSupervisors.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.currentGroups}/{s.maxGroups})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

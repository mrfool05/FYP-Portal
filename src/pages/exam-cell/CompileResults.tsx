import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockGroups } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';

export default function CompileResults() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <PageHeader title="Compile Results" description="Consolidated view of internal and external assessments" />
                <Button variant="outline">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export Master Sheet
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Group ID</TableHead>
                                <TableHead>Project Title</TableHead>
                                <TableHead>Supervisor (30%)</TableHead>
                                <TableHead>External (40%)</TableHead>
                                <TableHead>Evaluation (30%)</TableHead>
                                <TableHead className="text-right">Total (100%)</TableHead>
                                <TableHead>Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockGroups.map((group, i) => {
                                // Mock Marks
                                const sup = 25 + (i % 5);
                                const ext = 32 + (i % 8);
                                const evl = 24 + (i % 6);
                                const total = sup + ext + evl;
                                let grade = 'A';
                                if (total < 80) grade = 'B';
                                if (total < 70) grade = 'C';

                                return (
                                    <TableRow key={group.id}>
                                        <TableCell className="font-mono">{group.id}</TableCell>
                                        <TableCell className="font-medium">{group.name}</TableCell>
                                        <TableCell>{sup}</TableCell>
                                        <TableCell>{ext}</TableCell>
                                        <TableCell>{evl}</TableCell>
                                        <TableCell className="text-right font-bold">{total}</TableCell>
                                        <TableCell>
                                            <Badge variant={grade === 'A' ? 'default' : 'secondary'}>{grade}</Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

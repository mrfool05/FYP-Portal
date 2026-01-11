import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AuditLogs() {
    const logs = [
        { time: '2023-11-20 10:30', user: 'Admin', action: 'Direct Login', details: 'Successful login from IP 192.168.1.1' },
        { time: '2023-11-20 10:45', user: 'PMO', action: 'Update Project', details: 'Changed status of Group 12 to Approved' },
        { time: '2023-11-20 11:00', user: 'System', action: 'Backup', details: 'Automated database backup completed' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Audit Logs" description="View system activity and security logs" />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-mono text-xs">{log.time}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

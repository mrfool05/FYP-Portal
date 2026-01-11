import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Progress } from '@/components/ui/progress';
import { mockGroups, mockProjects } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export default function ProgressMonitor() {
    return (
        <div className="space-y-6">
            <PageHeader title="Progress Monitor" description="Track progress of all project groups across milestones" />

            <div className="grid gap-4">
                {mockGroups.map(group => {
                    const project = mockProjects.find(p => p.groupId === group.id);
                    const progress = project ? 45 : 0; // Mock progress logic

                    return (
                        <Card key={group.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{group.name}</h3>
                                        <p className="text-sm text-muted-foreground">{project?.title || 'No Project Started'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={project?.status === 'approved' ? 'default' : 'secondary'}>
                                            {project?.status?.toUpperCase() || 'NO STATUS'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Completion Progress</span>
                                        <span className="font-medium">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

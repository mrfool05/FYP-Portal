import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { Plus, Megaphone, Calendar } from 'lucide-react';
import { mockAnnouncements } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export default function PMOAnnouncements() {
    const [announcements, setAnnouncements] = useState(mockAnnouncements);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <PageHeader title="Announcements" description="Manage and publish department-wide announcements" />
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Announcement
                </Button>
            </div>

            <div className="grid gap-4">
                {announcements.map((announcement) => (
                    <Card key={announcement.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(announcement.publishedAt).toLocaleDateString()}
                                    <span>•</span>
                                    <span>{announcement.authorName}</span>
                                </CardDescription>
                            </div>
                            <Badge variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}>
                                {announcement.priority}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mt-2">{announcement.content}</p>
                            <div className="flex gap-2 mt-4">
                                {announcement.targetRoles.map(role => (
                                    <Badge key={role} variant="outline" className="text-xs uppercase">{role}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { FileText, Download, Upload } from 'lucide-react';
import { mockTemplates } from '@/data/mockData';

export default function Templates() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <PageHeader title="Templates & Forms" description="Manage standard templates for project documentation" />
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Template
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTemplates.map(template => (
                    <Card key={template.id}>
                        <CardHeader>
                            <FileText className="h-8 w-8 text-primary mb-2" />
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockSubmissions } from '@/data/mockData';
import { Upload, FileText, Download, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const milestones = [
  { id: 'proposal', label: 'Proposal', description: 'Initial project proposal' },
  { id: 'mid_term', label: 'Mid-Term', description: 'Progress report' },
  { id: 'final', label: 'Final', description: 'Complete project submission' },
];

export default function DocumentUpload() {
  const [selectedMilestone, setSelectedMilestone] = useState('proposal');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  // Get submissions for each milestone
  const getSubmissionForMilestone = (milestoneId: string) => {
    return mockSubmissions.find(s => s.milestoneType === milestoneId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    toast.success('Document uploaded successfully!');
    setSelectedFile(null);
    setDescription('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <PageHeader
        title="Document Upload"
        description="Upload and manage your project documents"
      />

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Submission Progress</span>
            <span className="text-sm text-muted-foreground">2/3 completed</span>
          </div>
          <Progress value={66} className="h-2" />
        </CardContent>
      </Card>

      {/* Milestone Tabs */}
      <Tabs value={selectedMilestone} onValueChange={setSelectedMilestone}>
        <TabsList className="grid w-full grid-cols-3">
          {milestones.map((milestone) => {
            const submission = getSubmissionForMilestone(milestone.id);
            return (
              <TabsTrigger key={milestone.id} value={milestone.id} className="relative">
                {milestone.label}
                {submission && (
                  <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-success" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {milestones.map((milestone) => {
          const submission = getSubmissionForMilestone(milestone.id);
          
          return (
            <TabsContent key={milestone.id} value={milestone.id} className="space-y-6 mt-6">
              {/* Existing Submission */}
              {submission && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Current Submission</CardTitle>
                        <CardDescription>Version {submission.version}</CardDescription>
                      </div>
                      <StatusBadge status={submission.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* File Info */}
                    <div className="flex items-center gap-4 rounded-lg border p-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{submission.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(submission.fileSize)} • Uploaded {format(submission.submittedAt, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>

                    {/* Similarity Score */}
                    {submission.similarityScore !== undefined && (
                      <div className="flex items-center gap-2 rounded-lg border p-3">
                        <Badge variant={submission.similarityScore < 20 ? 'default' : 'destructive'}>
                          {submission.similarityScore}% Similarity
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {submission.similarityScore < 20 ? 'Within acceptable range' : 'Please review for plagiarism'}
                        </span>
                      </div>
                    )}

                    {/* Feedback */}
                    {submission.feedback && (
                      <div className="rounded-lg border p-4 bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Supervisor Feedback</span>
                        </div>
                        <p className="text-sm">{submission.feedback}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Reviewed on {format(submission.reviewedAt!, 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Upload New Version */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {submission ? 'Upload New Version' : 'Upload Document'}
                  </CardTitle>
                  <CardDescription>
                    {milestone.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Select File</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, DOC, DOCX. Max size: 10MB
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add notes about this submission..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleUpload} className="w-full sm:w-auto">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </CardContent>
              </Card>

              {/* Version History */}
              {submission && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Version History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[2, 1].map((version) => (
                        <div
                          key={version}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Version {version}</p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded Jan {version === 2 ? '6' : '4'}, 2024
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

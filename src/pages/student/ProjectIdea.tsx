import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { mockProjects, mockGroups } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { FolderKanban, Upload, AlertTriangle, FileText, Edit2, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const domains = [
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'Blockchain',
  'Cybersecurity',
  'IoT',
  'Cloud Computing',
  'Data Science',
  'Other',
];

export default function ProjectIdea() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [abstract, setAbstract] = useState('');
  const [proposalFile, setProposalFile] = useState<File | null>(null);

  // Get user's group and project
  const group = mockGroups.find(g => g.members.some(m => m.userId === user?.id));
  const project = group ? mockProjects.find(p => p.groupId === group.id) : null;

  const isLocked = project?.status === 'approved' || project?.status === 'locked';

  const handleSubmit = () => {
    if (!title.trim() || !domain || !abstract.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Project idea submitted successfully!');
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProposalFile(e.target.files[0]);
    }
  };

  // Check if user has a group
  if (!group) {
    return (
      <div className="space-y-6 pb-16 lg:pb-0">
        <PageHeader
          title="Project Idea"
          description="Submit your project proposal"
        />
        <EmptyState
          icon={FolderKanban}
          title="Join a group first"
          description="You need to be part of a group before submitting a project idea"
          action={{
            label: 'Go to Group Management',
            onClick: () => window.location.href = '/student/group',
          }}
        />
      </div>
    );
  }

  // Show existing project
  if (project && !isEditing) {
    return (
      <div className="space-y-6 pb-16 lg:pb-0">
        <PageHeader
          title="Project Idea"
          description="Your submitted project proposal"
        >
          {!isLocked && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </PageHeader>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.domain}</CardDescription>
              </div>
              <StatusBadge status={project.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Abstract</h4>
              <p className="text-sm leading-relaxed">{project.abstract}</p>
            </div>

            {project.status === 'rejected' && project.rejectionReason && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Rejection Reason:</strong> {project.rejectionReason}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-4 rounded-lg border p-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">Proposal Document</p>
                <p className="text-sm text-muted-foreground">proposal-v2.pdf • 2.4 MB</p>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>

            {isLocked && (
              <Alert>
                <AlertDescription>
                  This project has been approved and cannot be edited.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show form for new project or editing
  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <PageHeader
        title="Project Idea"
        description={project ? 'Edit your project proposal' : 'Submit a new project proposal'}
      />

      <Card>
        <CardHeader>
          <CardTitle>Project Proposal</CardTitle>
          <CardDescription>
            Fill in the details of your project idea
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              placeholder="Enter your project title"
              value={title || project?.title || ''}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain / Category *</Label>
            <Select value={domain || project?.domain || ''} onValueChange={setDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              placeholder="Describe your project idea, objectives, and methodology..."
              value={abstract || project?.abstract || ''}
              onChange={(e) => setAbstract(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 100 words recommended
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal">Proposal Document</Label>
            <div className="flex items-center gap-4">
              <Input
                id="proposal"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
            {proposalFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {proposalFile.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX. Max size: 10MB
            </p>
          </div>

          {/* Similarity Warning (mock) */}
          <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-4 w-4 stroke-yellow-600 dark:stroke-yellow-400" />
            <AlertDescription>
              <strong className="font-semibold block mb-1">Similarity Check Warning</strong>
              Your proposal will be automatically scanned for plagiarism after submission. Ensure your similarity index is below 20% to avoid automatic rejection.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3">
            {isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {project ? 'Update Proposal' : 'Submit Proposal'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

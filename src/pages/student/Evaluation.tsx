import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockEvaluations, mockProjects, mockGroups } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Lock, FileText, MessageSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { EmptyState } from '@/components/shared/EmptyState';

export default function Evaluation() {
  const { user } = useAuth();

  // Get user's group and project
  const group = mockGroups.find(g => g.members.some(m => m.userId === user?.id));
  const project = group ? mockProjects.find(p => p.groupId === group.id) : null;
  const evaluations = project ? mockEvaluations.filter(e => e.projectId === project.id) : [];

  const markCategories = [
    { key: 'documentation', label: 'Documentation', max: 20 },
    { key: 'presentation', label: 'Presentation', max: 20 },
    { key: 'implementation', label: 'Implementation', max: 20 },
    { key: 'innovation', label: 'Innovation', max: 20 },
    { key: 'teamwork', label: 'Teamwork', max: 20 },
  ];

  // Calculate totals
  const totalMarks = evaluations.reduce((sum, e) => sum + e.totalMarks, 0);
  const maxPossibleMarks = evaluations.length * 100;
  const averagePercentage = evaluations.length > 0 ? (totalMarks / maxPossibleMarks) * 100 : 0;

  if (evaluations.length === 0) {
    return (
      <div className="space-y-6 pb-16 lg:pb-0">
        <PageHeader
          title="Evaluation & Marks"
          description="View your project evaluation and marks"
        />
        <EmptyState
          icon={Award}
          title="No evaluations yet"
          description="Your evaluations will appear here once your project has been evaluated"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <PageHeader
        title="Evaluation & Marks"
        description="View your project evaluation and marks"
      />

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Overall Score
              </CardTitle>
              <CardDescription>Based on {evaluations.length} evaluation(s)</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{totalMarks}</p>
              <p className="text-sm text-muted-foreground">out of {maxPossibleMarks}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Average Performance</span>
              <span className="font-medium">{Math.round(averagePercentage)}%</span>
            </div>
            <Progress value={averagePercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Individual Evaluations */}
      <div className="space-y-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {evaluation.evaluatorRole === 'supervisor' ? 'Internal Evaluation' : 'External Evaluation'}
                  </CardTitle>
                  <CardDescription>
                    By {evaluation.evaluatorName}
                    {evaluation.submittedAt && ` • ${format(evaluation.submittedAt, 'MMM d, yyyy')}`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={evaluation.status} />
                  {evaluation.status === 'locked' && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Marks Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Marks Breakdown</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {markCategories.map((category) => {
                    const marks = evaluation.marks[category.key as keyof typeof evaluation.marks];
                    const percentage = (marks / category.max) * 100;
                    
                    return (
                      <div key={category.key} className="rounded-lg border p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{category.label}</p>
                        <p className="text-xl font-bold">{marks}</p>
                        <p className="text-xs text-muted-foreground">/{category.max}</p>
                        <Progress value={percentage} className="h-1 mt-2" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <span className="font-medium">Total Marks</span>
                <div className="text-right">
                  <span className="text-2xl font-bold">{evaluation.totalMarks}</span>
                  <span className="text-muted-foreground">/{evaluation.maxMarks}</span>
                </div>
              </div>

              {/* Feedback */}
              {evaluation.feedback && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Evaluator Feedback</span>
                  </div>
                  <p className="text-sm">{evaluation.feedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ProjectSync Type Definitions
// ============================================

// User Roles
export type UserRole = 'student' | 'supervisor' | 'pmo' | 'external_panel' | 'exam_cell' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
}

// Extended role-specific user types
export interface Student extends User {
  role: 'student';
  enrollmentNumber: string;
  semester: number;
  groupId?: string;
  supervisorId?: string;
}

export interface Supervisor extends User {
  role: 'supervisor';
  expertise: string[];
  maxGroups: number;
  currentGroups: number;
  designation: string;
}

export interface PMOUser extends User {
  role: 'pmo';
  department: string;
}

// Project Status Types
export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'locked';
export type DocumentStatus = 'not_uploaded' | 'uploaded' | 'reviewed' | 'approved' | 'rejected';
export type EvaluationStatus = 'pending' | 'submitted' | 'locked';
export type SupervisionRequestStatus = 'pending' | 'accepted' | 'rejected';
export type MilestoneType = 'proposal' | 'mid_term' | 'final';

// Project Group
export interface ProjectGroup {
  id: string;
  name: string;
  members: GroupMember[];
  supervisorId?: string;
  supervisor?: Supervisor;
  projectId?: string;
  createdAt: Date;
  maxMembers: number;
}

export interface GroupMember {
  userId: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  role: 'leader' | 'member';
  joinedAt: Date;
}

// Project
export interface Project {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  status: ProjectStatus;
  groupId: string;
  supervisorId?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Supervision Request
export interface SupervisionRequest {
  id: string;
  groupId: string;
  group?: ProjectGroup;
  supervisorId: string;
  supervisor?: Supervisor;
  status: SupervisionRequestStatus;
  message?: string;
  responseMessage?: string;
  requestedAt: Date;
  respondedAt?: Date;
}

// Document Submission
export interface Submission {
  id: string;
  projectId: string;
  groupId: string;
  milestoneType: MilestoneType;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  version: number;
  status: DocumentStatus;
  submittedAt: Date;
  submittedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  feedback?: string;
  similarityScore?: number;
}

// Milestone / Progress
export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: MilestoneType;
  dueDate: Date;
  completedAt?: Date;
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
}

// Evaluation
export interface Evaluation {
  id: string;
  projectId: string;
  groupId: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: 'supervisor' | 'external_panel';
  marks: EvaluationMarks;
  totalMarks: number;
  maxMarks: number;
  feedback?: string;
  status: EvaluationStatus;
  submittedAt?: Date;
  lockedAt?: Date;
}

export interface EvaluationMarks {
  documentation: number;
  presentation: number;
  implementation: number;
  innovation: number;
  teamwork: number;
}

// Announcement
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  targetRoles: UserRole[];
  targetGroupIds?: string[];
  priority: 'low' | 'medium' | 'high';
  publishedAt: Date;
  expiresAt?: Date;
  isRead?: boolean;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'supervision_request'
  | 'supervision_response'
  | 'project_approved'
  | 'project_rejected'
  | 'document_feedback'
  | 'evaluation_submitted'
  | 'announcement'
  | 'deadline_reminder'
  | 'general';

// Academic Session
export interface AcademicSession {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  deadlines: SessionDeadline[];
}

export interface SessionDeadline {
  id: string;
  sessionId: string;
  name: string;
  type: MilestoneType | 'supervisor_selection' | 'group_formation';
  dueDate: Date;
}

// Audit Log (for Admin)
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
}

// Dashboard Statistics
export interface DashboardStats {
  totalProjects: number;
  pendingApprovals: number;
  activeGroups: number;
  completedProjects: number;
  averageProgress: number;
}

// Form/Template
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: MilestoneType | 'general';
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

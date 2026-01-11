import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, UserRole, Student } from '@/types';
import { Loader2, ShieldAlert, Users, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { CreateStaffDialog } from '@/components/admin/CreateStaffDialog';
import { CreateStudentDialog } from '@/components/admin/CreateStudentDialog';
import { useAuth } from '@/contexts/AuthContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RoleManagement() {
    const { user: currentUser } = useAuth();
    const [staff, setStaff] = useState<User[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch Staff (Non-Students)
            const staffQuery = query(collection(db, 'users'), where('role', '!=', 'student'));
            const staffSnapshot = await getDocs(staffQuery);
            const loadedStaff = staffSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as User));
            setStaff(loadedStaff);

            // Fetch Students
            const studentQuery = query(collection(db, 'users'), where('role', '==', 'student'));
            const studentSnapshot = await getDocs(studentQuery);
            const loadedStudents = studentSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Student));
            setStudents(loadedStudents);

        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRoleUpdate = async (userId: string, newRole: UserRole, currentRole: UserRole) => {
        if (newRole === currentRole) return;

        if (newRole === 'student') {
            toast.error("Cannot downgrade staff to student role");
            return;
        }

        setUpdatingId(userId);
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });

            // Audit Log
            if (currentUser) {
                await addDoc(collection(db, 'audit_logs'), {
                    userId: currentUser.id,
                    userName: currentUser.name,
                    userRole: currentUser.role,
                    action: 'ROLE_CHANGED',
                    details: `Changed role from ${currentRole} to ${newRole} for user ${userId}`,
                    timestamp: serverTimestamp(),
                });
            }

            toast.success('Role updated successfully');
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update role');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader title="User Management" description="Manage all users, roles, and accounts from a central dashboard." />

            <Tabs defaultValue="staff" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="staff" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Staff Members
                    </TabsTrigger>
                    <TabsTrigger value="students" className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Students
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="staff" className="space-y-4">
                    <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                        <div>
                            <h3 className="text-lg font-medium">Staff Accounts</h3>
                            <p className="text-sm text-muted-foreground">Manage administrative and academic staff roles</p>
                        </div>
                        <CreateStaffDialog onSuccess={fetchData} />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Staff List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {staff.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No staff members found.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {staff.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{user.name}</span>
                                                        {user.department && (
                                                            <span className="text-xs text-muted-foreground">{user.department}</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                                        {user.role.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            defaultValue={user.role}
                                                            onValueChange={(val) => handleRoleUpdate(user.id, val as UserRole, user.role)}
                                                            disabled={updatingId === user.id}
                                                        >
                                                            <SelectTrigger className="w-[140px] h-8">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                                                <SelectItem value="pmo">PMO</SelectItem>
                                                                <SelectItem value="external_panel">External Panel</SelectItem>
                                                                <SelectItem value="exam_cell">Exam Cell</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {updatingId === user.id && <Loader2 className="h-4 w-4 animate-spin" />}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50 border-dashed">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4 text-sm text-muted-foreground">
                                <ShieldAlert className="h-5 w-5 mt-0.5 shrink-0" />
                                <p>
                                    <strong>Role Policy:</strong> Roles grant specific permissions in the dashboard.
                                    Do not assign elevated privileges (e.g., PMO, Admin) without authorization.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                    <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                        <div>
                            <h3 className="text-lg font-medium">Student Accounts</h3>
                            <p className="text-sm text-muted-foreground">Manage enrolled students and their accounts</p>
                        </div>
                        <CreateStudentDialog onSuccess={fetchData} />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Enrolled Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {students.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No students found.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Enrollment #</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Semester</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map(s => (
                                            <TableRow key={s.id}>
                                                <TableCell className="font-mono">{s.enrollmentNumber || 'N/A'}</TableCell>
                                                <TableCell className="font-medium">{s.name}</TableCell>
                                                <TableCell>{s.email}</TableCell>
                                                <TableCell>{s.semester ? `Sem ${s.semester}` : '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { ProjectGroup, Project, Supervisor, Milestone, Announcement } from '@/types';

export function useStudentData() {
    const { user } = useAuth();
    const [group, setGroup] = useState<ProjectGroup | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [supervisor, setSupervisor] = useState<Supervisor | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!user) return;

            try {
                setLoading(true);

                // 1. Fetch Group
                // In a real app, you might want to store groupId in the user profile for faster lookup
                // But searching the 'groups' collection for the member is robust.
                // Array-contains won't work easily if members is an array of objects.
                // Limitation: If members is array of objects, simple query is hard.
                // WORKAROUND: For this MVP, we assume fetching all groups is expensive, 
                // so we should ideally have a 'memberIds' array field in the group document for querying.
                // I will assume for now we might need to query client side or add memberIds to schema.
                // Let's assume the schema has 'memberIds' for easier querying, or we can check user.groupId if we added it to profile.

                let foundGroup: ProjectGroup | null = null;

                // Option A: Check if user has groupId in profile (Efficient)
                // The type definition 'Student' has 'groupId'.
                const studentDoc = await getDoc(doc(db, 'users', user.id));
                const studentData = studentDoc.data();

                if (studentData?.groupId) {
                    const groupDoc = await getDoc(doc(db, 'groups', studentData.groupId));
                    if (groupDoc.exists()) {
                        foundGroup = { id: groupDoc.id, ...convertDates(groupDoc.data()) } as ProjectGroup;
                    }
                }
                // Option B: Query groups (Fallback for safety)
                else {
                    // This requires a composite index or a specific structure.
                    // For now, let's rely on the profile. If profile has no groupId, we assume no group.
                }

                setGroup(foundGroup);

                // 2. Fetch Project
                if (foundGroup?.projectId) {
                    const projectDoc = await getDoc(doc(db, 'projects', foundGroup.projectId));
                    if (projectDoc.exists()) {
                        setProject({ id: projectDoc.id, ...convertDates(projectDoc.data()) } as Project);
                    }
                } else if (foundGroup) {
                    // Double check if there is a project with generic query
                    const q = query(collection(db, 'projects'), where('groupId', '==', foundGroup.id));
                    const snapshot = await getDocs(q);
                    if (!snapshot.empty) {
                        setProject({ id: snapshot.docs[0].id, ...convertDates(snapshot.docs[0].data()) } as Project);
                    }
                }

                // 3. Fetch Supervisor
                if (foundGroup?.supervisorId) {
                    const supDoc = await getDoc(doc(db, 'users', foundGroup.supervisorId));
                    if (supDoc.exists()) {
                        setSupervisor({ id: supDoc.id, ...convertDates(supDoc.data()) } as Supervisor);
                    }
                }

                // 4. Fetch Milestones (if project exists)
                if (foundGroup?.projectId || project) {
                    // Logic to fetch milestones. For now returning empty or generic.
                    // In future, generic milestones could be fetched from 'academic_config'
                }

                // 5. Fetch Announcements
                const annQuery = query(
                    collection(db, 'announcements'),
                    where('targetRoles', 'array-contains', 'student'),
                    orderBy('publishedAt', 'desc'),
                    limit(3)
                );
                // Note: Requires index. If fails, wrap in try/catch or remove orderBy for now.
                try {
                    const annSnapshot = await getDocs(annQuery);
                    const anns = annSnapshot.docs.map(d => ({ id: d.id, ...convertDates(d.data()) } as Announcement));
                    setAnnouncements(anns);
                } catch (e: any) {
                    console.warn("Index missing for announcements, falling back to simple query", e);
                    // Fallback without sort if index error
                    try {
                        const q2 = query(collection(db, 'announcements'), where('targetRoles', 'array-contains', 'student'), limit(3));
                        const s2 = await getDocs(q2);
                        setAnnouncements(s2.docs.map(d => ({ id: d.id, ...convertDates(d.data()) } as Announcement)));
                    } catch (fallbackError) {
                        console.error("Failed to fetch announcements (fallback)", fallbackError);
                        setAnnouncements([]);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch student dashboard data", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user]);

    return { group, project, supervisor, milestones, announcements, loading };
}

// Helper to safely convert Firestore data to properly typed objects
const convertDates = (data: any): any => {
    if (!data) return data;
    const result = { ...data };
    Object.keys(result).forEach(key => {
        if (result[key] && typeof result[key] === 'object' && 'seconds' in result[key]) {
            result[key] = new Date(result[key].seconds * 1000);
        }
    });
    return result;
};

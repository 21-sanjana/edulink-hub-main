import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  description?: string;
  progress?: number;
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'docx' | 'video';
  courseId: string;
  url: string;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  courseId: string;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  content: string;
  submittedAt: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent';
}

export interface Score {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  ia1: number;
  ia2: number;
  cia1: number;
  cia2: number;
  cia3: number;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: QuizQuestion[];
  results: QuizResult[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  studentId: string;
  studentName: string;
  score: number;
  total: number;
  attemptedAt: string;
}

export interface Syllabus {
  id: string;
  courseId: string;
  title: string;
  url: string;
}

export interface VirtualClass {
  id: string;
  title: string;
  courseId: string;
  date: string;
  time: string;
  meetingLink: string;
}

interface DataContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  scores: Score[];
  setScores: React.Dispatch<React.SetStateAction<Score[]>>;
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  syllabi: Syllabus[];
  setSyllabi: React.Dispatch<React.SetStateAction<Syllabus[]>>;
  virtualClasses: VirtualClass[];
  setVirtualClasses: React.Dispatch<React.SetStateAction<VirtualClass[]>>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

const initialCourses: Course[] = [
  { id: 'c1', name: 'Data Structures & Algorithms', instructor: 'Dr. Sarah Johnson', duration: '4 months', description: 'Comprehensive DSA course', progress: 65 },
  { id: 'c2', name: 'Web Development', instructor: 'Prof. Mike Chen', duration: '3 months', description: 'Full-stack web development', progress: 40 },
  { id: 'c3', name: 'Database Management', instructor: 'Dr. Emily Davis', duration: '3 months', description: 'SQL and NoSQL databases', progress: 80 },
];

const initialAssignments: Assignment[] = [
  { id: 'a1', title: 'Binary Tree Implementation', description: 'Implement a binary search tree with insert, delete, and search operations', deadline: '2026-04-15', courseId: 'c1', submissions: [
    { id: 'sub1', studentId: 's1', studentName: 'Alex Thompson', assignmentId: 'a1', content: 'Submitted BST implementation', submittedAt: '2026-04-10', status: 'submitted' }
  ]},
  { id: 'a2', title: 'React Portfolio', description: 'Build a personal portfolio using React', deadline: '2026-04-20', courseId: 'c2', submissions: [] },
];

const initialMaterials: Material[] = [
  { id: 'm1', title: 'DSA Lecture Notes - Week 1', type: 'pdf', courseId: 'c1', url: '#', uploadedAt: '2026-03-01' },
  { id: 'm2', title: 'React Basics Video', type: 'video', courseId: 'c2', url: 'https://youtube.com', uploadedAt: '2026-03-05' },
  { id: 'm3', title: 'SQL Fundamentals', type: 'ppt', courseId: 'c3', url: '#', uploadedAt: '2026-03-10' },
];

const initialAttendance: AttendanceRecord[] = [
  { id: 'att1', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c1', subject: 'Arrays & Linked Lists', date: '2026-03-25', status: 'present' },
  { id: 'att2', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c1', subject: 'Arrays & Linked Lists', date: '2026-03-26', status: 'present' },
  { id: 'att3', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c1', subject: 'Trees & Graphs', date: '2026-03-27', status: 'absent' },
  { id: 'att4', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c2', subject: 'HTML & CSS', date: '2026-03-25', status: 'present' },
  { id: 'att5', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c2', subject: 'React Basics', date: '2026-03-26', status: 'present' },
  { id: 'att6', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c2', subject: 'React Basics', date: '2026-03-27', status: 'absent' },
  { id: 'att7', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c3', subject: 'SQL Queries', date: '2026-03-25', status: 'present' },
  { id: 'att8', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c3', subject: 'SQL Queries', date: '2026-03-26', status: 'present' },
  { id: 'att9', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c3', subject: 'Normalization', date: '2026-03-27', status: 'present' },
  { id: 'att10', studentId: 's2', studentName: 'Maria Garcia', courseId: 'c1', subject: 'Arrays & Linked Lists', date: '2026-03-25', status: 'present' },
  { id: 'att11', studentId: 's2', studentName: 'Maria Garcia', courseId: 'c1', subject: 'Trees & Graphs', date: '2026-03-27', status: 'present' },
];

const initialScores: Score[] = [
  { id: 'sc1', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c1', ia1: 18, ia2: 20, cia1: 38, cia2: 42, cia3: 45 },
  { id: 'sc2', studentId: 's1', studentName: 'Alex Thompson', courseId: 'c2', ia1: 15, ia2: 17, cia1: 35, cia2: 40, cia3: 38 },
];

const initialQuizzes: Quiz[] = [
  {
    id: 'q1', title: 'DSA Fundamentals Quiz', courseId: 'c1',
    questions: [
      { id: 'qq1', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1 },
      { id: 'qq2', question: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctAnswer: 1 },
      { id: 'qq3', question: 'What is a balanced BST?', options: ['AVL Tree', 'Linked List', 'Array', 'Hash Table'], correctAnswer: 0 },
    ],
    results: [],
  },
];

const initialVirtualClasses: VirtualClass[] = [
  { id: 'vc1', title: 'DSA Live Session - Trees', courseId: 'c1', date: '2026-04-05', time: '10:00 AM', meetingLink: 'https://meet.google.com/abc-defg-hij' },
  { id: 'vc2', title: 'React Workshop', courseId: 'c2', date: '2026-04-07', time: '2:00 PM', meetingLink: 'https://zoom.us/j/123456789' },
];

const initialSyllabi: Syllabus[] = [
  { id: 'syl1', courseId: 'c1', title: 'DSA Complete Syllabus', url: '#' },
  { id: 'syl2', courseId: 'c2', title: 'Web Dev Course Outline', url: '#' },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [scores, setScores] = useState<Score[]>(initialScores);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [syllabi, setSyllabi] = useState<Syllabus[]>(initialSyllabi);
  const [virtualClasses, setVirtualClasses] = useState<VirtualClass[]>(initialVirtualClasses);

  return (
    <DataContext.Provider value={{
      courses, setCourses,
      materials, setMaterials,
      assignments, setAssignments,
      attendance, setAttendance,
      scores, setScores,
      quizzes, setQuizzes,
      syllabi, setSyllabi,
      virtualClasses, setVirtualClasses,
    }}>
      {children}
    </DataContext.Provider>
  );
};

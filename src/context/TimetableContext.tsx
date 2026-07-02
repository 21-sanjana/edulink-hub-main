import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DailySlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subject: string;
  faculty: string;
  room: string;
  courseId: string;
}

export interface IASchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  courseId: string;
}

export interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  courseId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'event' | 'holiday' | 'exam' | 'academic';
  description?: string;
}

interface TimetableContextType {
  dailySlots: DailySlot[];
  setDailySlots: React.Dispatch<React.SetStateAction<DailySlot[]>>;
  iaSchedules: IASchedule[];
  setIASchedules: React.Dispatch<React.SetStateAction<IASchedule[]>>;
  examSchedules: ExamSchedule[];
  setExamSchedules: React.Dispatch<React.SetStateAction<ExamSchedule[]>>;
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const TimetableContext = createContext<TimetableContextType | null>(null);

export const useTimetable = () => {
  const ctx = useContext(TimetableContext);
  if (!ctx) throw new Error('useTimetable must be used within TimetableProvider');
  return ctx;
};

const initialDaily: DailySlot[] = [
  { id: 'd1', day: 'Monday', time: '9:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Sarah Johnson', room: 'Room 101', courseId: 'c1' },
  { id: 'd2', day: 'Monday', time: '10:00 AM', subject: 'Web Development', faculty: 'Prof. Mike Chen', room: 'Lab 201', courseId: 'c2' },
  { id: 'd3', day: 'Monday', time: '11:00 AM', subject: 'Database Management', faculty: 'Dr. Emily Davis', room: 'Room 102', courseId: 'c3' },
  { id: 'd4', day: 'Tuesday', time: '9:00 AM', subject: 'Web Development', faculty: 'Prof. Mike Chen', room: 'Lab 201', courseId: 'c2' },
  { id: 'd5', day: 'Tuesday', time: '10:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Sarah Johnson', room: 'Room 101', courseId: 'c1' },
  { id: 'd6', day: 'Wednesday', time: '9:00 AM', subject: 'Database Management', faculty: 'Dr. Emily Davis', room: 'Room 102', courseId: 'c3' },
  { id: 'd7', day: 'Wednesday', time: '11:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Sarah Johnson', room: 'Room 101', courseId: 'c1' },
  { id: 'd8', day: 'Thursday', time: '9:00 AM', subject: 'Web Development', faculty: 'Prof. Mike Chen', room: 'Lab 201', courseId: 'c2' },
  { id: 'd9', day: 'Friday', time: '9:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Dr. Sarah Johnson', room: 'Room 101', courseId: 'c1' },
  { id: 'd10', day: 'Friday', time: '10:00 AM', subject: 'Database Management', faculty: 'Dr. Emily Davis', room: 'Room 102', courseId: 'c3' },
];

const initialIA: IASchedule[] = [
  { id: 'ia1', subject: 'Data Structures & Algorithms', date: '2026-04-15', time: '10:00 AM', courseId: 'c1' },
  { id: 'ia2', subject: 'Web Development', date: '2026-04-18', time: '2:00 PM', courseId: 'c2' },
  { id: 'ia3', subject: 'Database Management', date: '2026-04-20', time: '10:00 AM', courseId: 'c3' },
];

const initialExams: ExamSchedule[] = [
  { id: 'ex1', subject: 'Data Structures & Algorithms', date: '2026-05-10', time: '9:00 AM', duration: '3 hours', courseId: 'c1' },
  { id: 'ex2', subject: 'Web Development', date: '2026-05-13', time: '9:00 AM', duration: '3 hours', courseId: 'c2' },
  { id: 'ex3', subject: 'Database Management', date: '2026-05-16', time: '9:00 AM', duration: '3 hours', courseId: 'c3' },
];

const initialCalendar: CalendarEvent[] = [
  { id: 'ce1', title: 'Semester Start', date: '2026-03-01', type: 'academic', description: 'Spring semester begins' },
  { id: 'ce2', title: 'Republic Day', date: '2026-01-26', type: 'holiday', description: 'National holiday' },
  { id: 'ce3', title: 'Annual Tech Fest', date: '2026-04-25', type: 'event', description: 'College annual technical festival' },
  { id: 'ce4', title: 'Mid-Semester Break', date: '2026-04-01', type: 'holiday', description: 'Mid-semester break starts' },
  { id: 'ce5', title: 'IA-1 Exams Begin', date: '2026-04-15', type: 'exam', description: 'Internal Assessment 1 starts' },
  { id: 'ce6', title: 'Semester End Exams', date: '2026-05-10', type: 'exam', description: 'Final semester exams begin' },
  { id: 'ce7', title: 'Summer Break', date: '2026-06-01', type: 'holiday', description: 'Summer vacation begins' },
  { id: 'ce8', title: 'Orientation Day', date: '2026-03-05', type: 'event', description: 'New student orientation' },
];

export const TimetableProvider = ({ children }: { children: ReactNode }) => {
  const [dailySlots, setDailySlots] = useState<DailySlot[]>(initialDaily);
  const [iaSchedules, setIASchedules] = useState<IASchedule[]>(initialIA);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>(initialExams);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendar);

  return (
    <TimetableContext.Provider value={{
      dailySlots, setDailySlots,
      iaSchedules, setIASchedules,
      examSchedules, setExamSchedules,
      calendarEvents, setCalendarEvents,
    }}>
      {children}
    </TimetableContext.Provider>
  );
};

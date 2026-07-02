import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'faculty' | 'student';
  receiverId: string | null;
  courseId: string | null;
  message: string;
  timestamp: string;
  type: 'public' | 'private' | 'mentor';
}

export interface MentorAssignment {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
}

export interface MentorMeeting {
  id: string;
  mentorId: string;
  studentId: string;
  title: string;
  date: string;
  time: string;
  meetingLink: string;
}

export interface LogbookEntry {
  id: string;
  mentorId: string;
  studentId: string;
  studentName: string;
  date: string;
  remarks: string;
  performance: 'excellent' | 'good' | 'average' | 'needs-improvement';
  issues: string;
  suggestions: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  mentorAssignments: MentorAssignment[];
  setMentorAssignments: React.Dispatch<React.SetStateAction<MentorAssignment[]>>;
  mentorMeetings: MentorMeeting[];
  setMentorMeetings: React.Dispatch<React.SetStateAction<MentorMeeting[]>>;
  logbook: LogbookEntry[];
  setLogbook: React.Dispatch<React.SetStateAction<LogbookEntry[]>>;
  sendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

const initialMessages: ChatMessage[] = [
  { id: 'msg1', senderId: 'f1', senderName: 'Dr. Sarah Johnson', senderRole: 'faculty', receiverId: null, courseId: 'c1', message: 'Welcome to DSA! Please review the syllabus before next class.', timestamp: '2026-03-25T10:00:00', type: 'public' },
  { id: 'msg2', senderId: 's1', senderName: 'Alex Thompson', senderRole: 'student', receiverId: null, courseId: 'c1', message: 'Thank you! Will the first assignment cover linked lists?', timestamp: '2026-03-25T10:05:00', type: 'public' },
  { id: 'msg3', senderId: 'f1', senderName: 'Dr. Sarah Johnson', senderRole: 'faculty', receiverId: 's1', courseId: null, message: 'Hi Alex, your last assignment was excellent. Keep it up!', timestamp: '2026-03-26T14:00:00', type: 'private' },
  { id: 'msg4', senderId: 's1', senderName: 'Alex Thompson', senderRole: 'student', receiverId: 'f1', courseId: null, message: 'Thank you, Dr. Johnson! I had a question about the tree traversal topic.', timestamp: '2026-03-26T14:10:00', type: 'private' },
  { id: 'msg5', senderId: 'f1', senderName: 'Dr. Sarah Johnson', senderRole: 'faculty', receiverId: 's1', courseId: null, message: 'How are you feeling about your progress this semester?', timestamp: '2026-03-27T09:00:00', type: 'mentor' },
  { id: 'msg6', senderId: 's1', senderName: 'Alex Thompson', senderRole: 'student', receiverId: 'f1', courseId: null, message: 'I feel good overall, but struggling a bit with graphs.', timestamp: '2026-03-27T09:15:00', type: 'mentor' },
];

const initialMentorAssignments: MentorAssignment[] = [
  { id: 'ma1', mentorId: 'f1', mentorName: 'Dr. Sarah Johnson', studentId: 's1', studentName: 'Alex Thompson' },
  { id: 'ma2', mentorId: 'f1', mentorName: 'Dr. Sarah Johnson', studentId: 's2', studentName: 'Maria Garcia' },
];

const initialMeetings: MentorMeeting[] = [
  { id: 'mm1', mentorId: 'f1', studentId: 's1', title: 'Progress Review - April', date: '2026-04-10', time: '11:00 AM', meetingLink: 'https://meet.google.com/abc-review' },
  { id: 'mm2', mentorId: 'f1', studentId: 's2', title: 'Career Guidance Session', date: '2026-04-12', time: '3:00 PM', meetingLink: 'https://zoom.us/j/987654321' },
];

const initialLogbook: LogbookEntry[] = [
  { id: 'lb1', mentorId: 'f1', studentId: 's1', studentName: 'Alex Thompson', date: '2026-03-20', remarks: 'Good progress in DSA. Needs to focus on graph algorithms.', performance: 'good', issues: 'Struggling with graph traversals', suggestions: 'Practice BFS/DFS problems on LeetCode' },
  { id: 'lb2', mentorId: 'f1', studentId: 's2', studentName: 'Maria Garcia', date: '2026-03-22', remarks: 'Excellent performance overall.', performance: 'excellent', issues: 'None significant', suggestions: 'Consider participating in coding competitions' },
];

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [mentorAssignments, setMentorAssignments] = useState<MentorAssignment[]>(initialMentorAssignments);
  const [mentorMeetings, setMentorMeetings] = useState<MentorMeeting[]>(initialMeetings);
  const [logbook, setLogbook] = useState<LogbookEntry[]>(initialLogbook);

  const sendMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...msg,
      id: `msg${Date.now()}`,
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <ChatContext.Provider value={{
      messages, setMessages,
      mentorAssignments, setMentorAssignments,
      mentorMeetings, setMentorMeetings,
      logbook, setLogbook,
      sendMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

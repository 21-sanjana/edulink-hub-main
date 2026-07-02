import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTimetable } from '@/context/TimetableContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, List, ChevronLeft, ChevronRight } from 'lucide-react';

const typeColors: Record<string, string> = {
  event: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  holiday: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  exam: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  academic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

const StudentCalendar = () => {
  const { calendarEvents } = useTimetable();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  const upcoming = calendarEvents.filter(e => e.date >= new Date().toISOString().split('T')[0]).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">📆 Academic Calendar</h1>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-1" />Calendar</TabsTrigger>
            <TabsTrigger value="upcoming"><List className="w-4 h-4 mr-1" />Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(new Date(year, month - 1))}><ChevronLeft className="w-4 h-4" /></Button>
                  <CardTitle>{monthName}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(new Date(year, month + 1))}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-px">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="p-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30">{d}</div>
                  ))}
                  {calendarDays.map((day, i) => (
                    <div key={i} className={`min-h-[80px] border border-border/50 p-1 ${day ? 'bg-card' : 'bg-muted/10'}`}>
                      {day && (
                        <>
                          <span className="text-xs font-medium text-foreground">{day}</span>
                          <div className="space-y-0.5 mt-0.5">
                            {getEventsForDay(day).map(ev => (
                              <div key={ev.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${typeColors[ev.type]}`}>{ev.title}</div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400" />Event</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400" />Holiday</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400" />Exam</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-400" />Academic</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3">
            {upcoming.length === 0 ? (
              <Card><CardContent className="p-6 text-center text-muted-foreground">No upcoming events</CardContent></Card>
            ) : upcoming.map(ev => (
              <Card key={ev.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{ev.title}</h3>
                    {ev.description && <p className="text-sm text-muted-foreground">{ev.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{ev.date}</span>
                    <Badge className={typeColors[ev.type]}>{ev.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentCalendar;

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useTimetable, CalendarEvent } from '@/context/TimetableContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2, Calendar, List, ChevronLeft, ChevronRight } from 'lucide-react';

const typeColors: Record<string, string> = {
  event: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  holiday: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  exam: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  academic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

const FacultyCalendar = () => {
  const { calendarEvents, setCalendarEvents } = useTimetable();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', type: 'event' as CalendarEvent['type'], description: '' });
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April 2026

  const handleAdd = () => {
    if (!form.title || !form.date) { toast.error('Fill required fields'); return; }
    setCalendarEvents(prev => [...prev, { ...form, id: `ce${Date.now()}` }]);
    setForm({ title: '', date: '', type: 'event', description: '' });
    setOpen(false);
    toast.success('Event added!');
  };

  // Calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">📆 Academic Calendar</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Event</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Calendar Event</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v as CalendarEvent['type'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="academic">Academic Activity</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                <Button onClick={handleAdd} className="w-full">Add Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-1" />Calendar</TabsTrigger>
            <TabsTrigger value="list"><List className="w-4 h-4 mr-1" />List</TabsTrigger>
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

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calendarEvents.sort((a, b) => a.date.localeCompare(b.date)).map(ev => (
                      <TableRow key={ev.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{ev.title}</TableCell>
                        <TableCell>{ev.date}</TableCell>
                        <TableCell><Badge className={typeColors[ev.type]}>{ev.type}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{ev.description || '—'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => { setCalendarEvents(p => p.filter(e => e.id !== ev.id)); toast.success('Deleted'); }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FacultyCalendar;

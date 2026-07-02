import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  message: string;
  created_at: string;
}

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      toast.error(error.message);
      return;
    }

    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user?.id || '',
      sender_name: user?.name || 'User',
      sender_role: user?.role || 'student',
      message,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setMessage('');
    fetchMessages();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Common Chat</h1>

        <div className="bg-card rounded-xl card-shadow p-5 h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.sender_id === user?.id
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-xs opacity-80">
                  {msg.sender_name} · {msg.sender_role}
                </p>

                <p className="text-sm">{msg.message}</p>

                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Type message..."
              className="flex-1 px-4 py-2 rounded-xl border bg-background"
            />

            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
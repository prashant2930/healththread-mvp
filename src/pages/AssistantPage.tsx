import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, User as UserIcon } from 'lucide-react';
import { useData } from '../data/DataContext';
import { AssistantMessageCard } from '../components/assistant/AssistantMessageCard';
import { AppointmentFlow } from '../components/assistant/AppointmentFlow';
import type { HealthProfile, AssistantMessage, AssistantIntent } from '../types';

export function AssistantPage() {
  const data = useData();
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const profs = await data.getProfiles();
        setProfiles(profs);
        if (profs.length > 0) {
          const defaultProf = profs.find(p => p.fullName.includes('Rajesh')) || profs[0];
          setSelectedProfileId(defaultProf.id);
          
          setMessages([
            {
              id: 'msg-1',
              role: 'assistant',
              content: `Hello! I'm the HealthThread Assistant. I can help you coordinate care for ${defaultProf.fullName}. Try asking me to show active medicines, recent vitals, prepare a doctor brief, or find an appointment.`,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedProfileId(newId);
    const prof = profiles.find(p => p.id === newId);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `I've switched context to ${prof?.fullName}. How can I help you coordinate their care?`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const parseIntent = (text: string): AssistantIntent => {
    const lower = text.toLowerCase();
    if (lower.includes('medicine') || lower.includes('medication') || lower.includes('pills')) return 'show_medicines';
    if (lower.includes('report') || lower.includes('record')) return 'show_reports';
    if (lower.includes('vital') || lower.includes('bp') || lower.includes('pressure') || lower.includes('sugar')) return 'show_vitals';
    if (lower.includes('follow') || lower.includes('next')) return 'show_followups';
    if (lower.includes('brief') || lower.includes('summary')) return 'prepare_brief';
    if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('book')) return 'find_appointment';
    return 'unknown';
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedProfileId) return;

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const intent = parseIntent(userMsg.content);

    // Simulate AI thinking time
    setTimeout(async () => {
      let responseContent = "I couldn't quite understand that. Try asking about medicines, vitals, reports, or appointments.";
      let responseData = null;

      try {
        switch (intent) {
          case 'show_medicines':
            responseData = await data.getActiveMedications(selectedProfileId);
            responseContent = "Here are the active medications:";
            break;
          case 'show_vitals':
            responseData = await data.getVitalsByProfile(selectedProfileId);
            responseContent = "Here is a snapshot of the latest vitals:";
            break;
          case 'show_reports':
            responseData = await data.getRecordsByProfile(selectedProfileId);
            responseContent = "Here are the most recent medical records:";
            break;
          case 'show_followups':
            responseData = await data.getUpcomingFollowUps(selectedProfileId);
            responseContent = "Here are the upcoming follow-up consultations:";
            break;
          case 'prepare_brief':
            responseData = { ready: true };
            responseContent = "I've compiled the executive summary for the physician.";
            break;
          case 'find_appointment':
            responseData = { flow: 'appointment' };
            responseContent = "Sure, I can help you find an appointment. What speciality and location are you looking for?";
            break;
        }
      } catch (err) {
        console.error(err);
        responseContent = "Sorry, I encountered an error fetching that information.";
      }

      const assistantMsg: AssistantMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        intent,
        data: responseData,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-heading font-bold text-navy-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-sage-600" />
            Care Assistant
          </h1>
          <p className="text-navy-500 mt-2">
            Ask questions to quickly surface health info and coordinate care.
          </p>
        </div>
        
        <select 
          className="px-4 py-2 rounded-xl border border-ivory-300 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-sage-500 max-w-[200px]"
          value={selectedProfileId}
          onChange={handleProfileChange}
        >
          {profiles.map(p => (
            <option key={p.id} value={p.id}>{p.fullName}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-ivory-200 overflow-hidden flex flex-col relative">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-sage-600 text-white rounded-tr-sm' 
                    : 'bg-ivory-50 border border-ivory-200 text-navy-900 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  
                  {msg.role === 'assistant' && msg.intent && msg.intent !== 'find_appointment' && (
                    <AssistantMessageCard intent={msg.intent} data={msg.data} />
                  )}

                  {msg.role === 'assistant' && msg.intent === 'find_appointment' && (
                    <AppointmentFlow 
                      profileId={selectedProfileId} 
                      onComplete={() => {
                        setMessages(prev => [...prev, {
                          id: `ast-${Date.now()}`,
                          role: 'assistant',
                          content: 'Your appointment request has been logged successfully.',
                          timestamp: new Date().toISOString()
                        }]);
                      }} 
                    />
                  )}
                </div>
                <div className={`text-[10px] text-navy-400 mt-1.5 flex items-center gap-1.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {msg.role === 'user' ? 'You' : 'HealthThread Assistant'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-ivory-200 flex items-center justify-center shrink-0 order-2">
                  <UserIcon className="w-5 h-5 text-navy-500" />
                </div>
              )}
              
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-ivory-50 border border-ivory-200 p-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5 items-center h-4">
                  <div className="w-2 h-2 bg-navy-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-navy-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-navy-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-ivory-200 shrink-0">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about active medicines, latest reports, or find an appointment..."
              className="w-full pl-6 pr-14 py-4 rounded-full border border-ivory-300 bg-ivory-50/50 text-navy-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-full bg-sage-500 hover:bg-sage-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

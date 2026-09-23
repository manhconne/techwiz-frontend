'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, X, Disc } from 'lucide-react';

interface ChatbotModalProps {
  onFilterArtist: (artistId: string) => void;
  onOpenCart: () => void;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ onFilterArtist, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-0',
      sender: 'bot',
      text: 'Hello K-Pop Stan! 💖 I am your Fan Hub Plus assistant. How can I help you discover albums, concert tickets, or first-press photocards today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const generateBotReply = (userQuery: string): { reply: string; action?: ChatMessage['suggestedAction'] } => {
    const q = userQuery.toLowerCase();

    if (q.includes('newjeans') || q.includes('bunnies') || q.includes('super shy')) {
      return {
        reply: 'NewJeans is headlining with their "Get Up" EP featuring the viral Bunny Beach Bag version and 5 full photocards! Would you like me to filter to NewJeans right now?',
        action: { type: 'filter_artist', payload: 'newjeans' },
      };
    }

    if (q.includes('blackpink') || q.includes('blink') || q.includes('born pink')) {
      return {
        reply: 'BLACKPINK has the "BORN PINK" Limited Edition album and official Hammer Bong Ver.2! Their Hanoi stadium encore concert is also listed in our Tour section.',
        action: { type: 'filter_artist', payload: 'blackpink' },
      };
    }

    if (q.includes('photocard') || q.includes('card') || q.includes('pob')) {
      return {
        reply: 'All albums on Fan Hub Plus are brand new sealed First-Press copies including official Pre-order Benefits (POB) and holographic photocards. You can preview them in the Album Details modal!',
      };
    }

    if (q.includes('tour') || q.includes('concert') || q.includes('ticket')) {
      return {
        reply: 'We feature upcoming World Tour dates including BLACKPINK in Hanoi (My Dinh Stadium) and NewJeans in Ho Chi Minh City! Check out the World Tour Calendar section for ticket details.',
      };
    }

    if (q.includes('cart') || q.includes('checkout') || q.includes('buy')) {
      return {
        reply: 'You can access your cart anytime from the top navigation bar or click the button below to check out!',
        action: { type: 'open_cart', payload: '' },
      };
    }

    return {
      reply: `Thanks for asking about "${userQuery}"! Fan Hub Plus delivers 100% authentic K-pop albums direct from Seoul, officially counted on Hanteo and Circle Charts. Feel free to explore our top artists like NewJeans, BLACKPINK, BTS, Stray Kids, IVE, or aespa.`,
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const { reply, action } = generateBotReply(text);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const promptSuggestions = [
    'Tell me about NewJeans Get Up album',
    'Are photocards included with pre-orders?',
    'What world tours are coming soon?',
  ];

  return (
    <>
      {/* Floating Action Trigger Button - Solid Sky Blue */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 text-white rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2 group"
        style={{ backgroundColor: '#0284c7', boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)' }}
        title="Open AI Fandom Assistant"
        type="button"
      >
        <Bot className="w-6 h-6 animate-bounce" />
        <span className="hidden sm:inline text-xs font-bold pr-1">K-Bot AI</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-white" />
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-h-[560px] h-[520px] bg-white shadow-2xl border flex flex-col overflow-hidden"
          style={{ borderColor: '#bae6fd', borderRadius: '8px' }}
        >
          
          {/* Header - Solid Sky Blue */}
          <div 
            className="text-white px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: '#0284c7' }}
          >
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '32px', height: '32px', borderRadius: '50%' }}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight">K-Pop Fan Assistant AI</h3>
                <p className="text-[10px] text-sky-100">Live 24/7 Fandom & Album Guide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-sky-100 p-1 rounded transition-colors cursor-pointer"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-2 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 rounded-full font-medium transition-colors cursor-pointer"
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className="max-w-[85%] p-3 text-xs leading-relaxed"
                  style={{
                    backgroundColor: msg.sender === 'user' ? '#0284c7' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    borderRadius: '8px',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  }}
                >
                  <p>{msg.text}</p>

                  {/* Contextual Action Button */}
                  {msg.suggestedAction && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      {msg.suggestedAction.type === 'filter_artist' && (
                        <button
                          onClick={() => {
                            if (msg.suggestedAction) onFilterArtist(msg.suggestedAction.payload);
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                          style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px' }}
                          type="button"
                        >
                          <Disc className="w-3 h-3" />
                          <span>Filter to {msg.suggestedAction.payload.toUpperCase()}</span>
                        </button>
                      )}
                      {msg.suggestedAction.type === 'open_cart' && (
                        <button
                          onClick={() => {
                            onOpenCart();
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                          style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '8px' }}
                          type="button"
                        >
                          <span>Open Fan Cart</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about comeback albums, photocards, tour tickets..."
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 focus:outline-none"
              style={{ borderRadius: '8px' }}
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 text-white transition-colors cursor-pointer shadow-xs"
              style={{ backgroundColor: '#0284c7', borderRadius: '8px' }}
              title="Send"
              type="button"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

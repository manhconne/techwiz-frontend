'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatbotModalProps {
  onFilterArtist: (artistId: string) => void;
  onOpenCart: () => void;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ onFilterArtist, onOpenCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isGamingTheme, setIsGamingTheme] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkTheme = () => {
      const themeAttr = document.documentElement.getAttribute('data-fandom-theme') || 
                        document.body.getAttribute('data-fandom-theme');
      setIsGamingTheme(themeAttr === 'gaming');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-fandom-theme'] });
    return () => observer.disconnect();
  }, []);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-0',
      sender: 'bot',
      text: 'SYSTEM // FANHUB AI CONSOLE V2.0 READY.\nHello Fandom Stan. I am your AI System Assistant. What stadium concert tickets, 4K trailers, lossless audio tracks, or verified releases can I assist you with today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fanhub_chat_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialMessages;
  });

  // Save chat history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('fanhub_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleClearHistory = () => {
    setMessages(initialMessages);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fanhub_chat_history');
    }
  };

  const generateBotReply = (userQuery: string): { reply: string; action?: ChatMessage['suggestedAction'] } => {
    const q = userQuery.toLowerCase();

    // 1. Multimedia Center & Trailer & Rating
    if (q.includes('trailer') || q.includes('multimedia') || q.includes('podcast') || q.includes('review') || q.includes('rating') || q.includes('soundtrack')) {
      return {
        reply: 'SYSTEM // MULTIMEDIA BROADCAST ACTIVE:\nStream 4K trailers, backstage videos, 24-bit lossless audio tracks, and participate in community ratings at the Cinematheque & Sound Lab.',
        action: { type: 'view_album', payload: 'multimedia' },
      };
    }

    // 2. Location-Aware GPS & Meetup Map
    if (q.includes('location') || q.includes('gps') || q.includes('map') || q.includes('nearby') || q.includes('meetup') || q.includes('cafe')) {
      return {
        reply: 'SYSTEM // EVENT RADAR GPS:\nAutomatically discovering cup sleeves, photocard trading sessions, and live arena concerts in your local area.',
        action: { type: 'view_album', payload: 'event' },
      };
    }

    // 3. NewJeans
    if (q.includes('newjeans') || q.includes('bunnies') || q.includes('supernatural') || q.includes('how sweet')) {
      return {
        reply: 'SYSTEM // ARTIST NEWJEANS:\n"Supernatural" 4K single and "Get Up" EP First Press available. Would you like to filter NewJeans on the catalog grid?',
        action: { type: 'filter_artist', payload: 'newjeans' },
      };
    }

    // 4. BLACKPINK
    if (q.includes('blackpink') || q.includes('blink') || q.includes('born pink')) {
      return {
        reply: 'SYSTEM // ARTIST BLACKPINK:\n"BORN PINK" Limited Boxset and Stadium World Tour schedule are synced into the system.',
        action: { type: 'filter_artist', payload: 'blackpink' },
      };
    }

    // 5. Concert Tickets
    if (q.includes('ticket') || q.includes('pass') || q.includes('concert') || q.includes('tour')) {
      return {
        reply: 'SYSTEM // WORLD TOUR STADIUM SCHEDULE:\nSEVENTEEN, BLACKPINK Encore, and Say Hi All-Stars stage pass reservations and ticketing links are live.',
        action: { type: 'view_album', payload: 'event' },
      };
    }

    // 6. Fan-Submitted Articles
    if (q.includes('submit') || q.includes('article') || q.includes('post') || q.includes('community')) {
      return {
        reply: 'SYSTEM // SUBMIT FANDOM DISPATCH:\nYou can submit reviews or lore analysis by clicking "[+ SUBMIT POST]" in the Fandom Community section.',
      };
    }

    // 7. Photocards authenticity
    if (q.includes('photocard') || q.includes('card') || q.includes('pob') || q.includes('auth')) {
      return {
        reply: 'SYSTEM // OFFICIAL AUTHENTICITY:\n100% factory-sealed official imports with original Pre-Order Benefits (POB), counting towards Hanteo & Circle Charts.',
      };
    }

    // 8. Showcase / Cart
    if (q.includes('cart') || q.includes('buy') || q.includes('checkout') || q.includes('bag') || q.includes('pre-order')) {
      return {
        reply: 'SYSTEM // SHOWCASE PRE-ORDER ALERT:\nThis platform operates under non-commercial Showcase Discovery standards. Register alerts for official drop notifications.',
        action: { type: 'open_cart', payload: '' },
      };
    }

    return {
      reply: `SYSTEM ACKNOWLEDGED: "${userQuery}".\nFan Hub Plus supports multi-fandom queries (K-Pop, Anime, Gaming, Cinema, Cosplay). You can select a quick prompt below.`,
    };
  };

  const handleSend = async (textToSend?: string) => {
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

    try {
      const res = await fetch("http://localhost:3005/api/v1/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: data.reply || generateBotReply(text).reply,
        suggestedAction: generateBotReply(text).action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const botReply = generateBotReply(text);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botReply.reply,
        suggestedAction: botReply.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const promptSuggestions = [
    'TRAILER 4K & RATING',
    'GPS EVENT RADAR',
    'STADIUM TOUR DATES',
    'SUBMIT FANDOM POST',
    'AUTHENTICITY VERIFY',
    'ALBUM NEWJEANS GET UP',
  ];

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderRadius: '0px' }}
        className={`fixed bottom-6 right-6 z-40 px-4 py-3 ${isGamingTheme ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-black shadow-none' : 'bg-[#d91470] text-white hover:bg-[#be185d] border-3 border-black shadow-[4px_4px_0px_#000000]'} font-mono text-xs font-black uppercase tracking-widest cursor-pointer transition-colors duration-100 flex items-center gap-2.5`}
        title="Launch AI Fandom Assistant"
        type="button"
      >
        <span className={`w-2.5 h-2.5 ${isGamingTheme ? 'bg-white' : 'bg-[#ffd60a]'} border border-black animate-ping`} />
        <span>★ AI BOT // FANDOM OS ✦</span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div 
          style={{ borderRadius: '0px' }}
          className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[450px] max-h-[620px] h-[560px] bg-white text-black border-3 border-black flex flex-col overflow-hidden ${isGamingTheme ? 'shadow-none' : 'shadow-[8px_8px_0px_#000000]'} font-mono text-xs`}
        >
          {/* Y2K Window Bar Header */}
          <div className={`${isGamingTheme ? 'bg-black text-white' : 'bg-[#ffd60a] text-black'} px-4 py-2.5 flex items-center justify-between border-b-3 border-black select-none`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 ${isGamingTheme ? 'bg-white' : 'bg-[#ff2e93]'} border border-black`} />
              <span className="font-black tracking-widest text-[11px] uppercase">
                SYS.AI // FANDOM_OPERATOR_V2.0
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                className={`bg-white ${isGamingTheme ? 'hover:bg-black hover:text-white shadow-none' : 'hover:bg-[#ecfeff] shadow-[1px_1px_0px_#000]'} text-black px-2 py-0.5 border border-black text-[10px] font-black uppercase cursor-pointer`}
                title="Purge chat log"
                type="button"
              >
                [PURGE]
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`${isGamingTheme ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-white shadow-none' : 'bg-[#ff2e93] text-white hover:bg-[#e11d48] border-2 border-black shadow-[1px_1px_0px_#000]'} px-2 py-0.5 text-[10px] font-black cursor-pointer`}
                title="Close Window"
                type="button"
              >
                [✕]
              </button>
            </div>
          </div>

          {/* Quick FAQ Chips Bar */}
          <div className={`p-2.5 ${isGamingTheme ? 'bg-neutral-100' : 'bg-[#ecfeff]'} border-b-2 border-black flex gap-1.5 overflow-x-auto scrollbar-none text-[10px]`}>
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                style={{ borderRadius: '0px' }}
                className={`whitespace-nowrap px-2.5 py-1 ${isGamingTheme ? 'bg-white hover:bg-black hover:text-white shadow-none' : 'bg-white hover:bg-[#ffd60a] shadow-[1px_1px_0px_#000]'} text-black border-2 border-black font-black uppercase transition-colors cursor-pointer shrink-0`}
                type="button"
              >
                ★ {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fdfbf7] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  style={{ borderRadius: '0px' }}
                  className={`max-w-[90%] p-3.5 border-2 border-black shadow-[3px_3px_0px_#000000] ${
                    msg.sender === 'user'
                      ? 'bg-[#00f0ff] text-black'
                      : 'bg-white text-black'
                  }`}
                >
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1 flex items-center gap-1">
                    <span>{msg.sender === 'user' ? '⚡ USER_PROMPT' : '✪ SYSTEM_TELETYPE'}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed font-mono font-medium">{msg.text}</p>

                  {/* Contextual Action Button */}
                  {msg.suggestedAction && (
                    <div className="mt-3 pt-2.5 border-t-2 border-black flex flex-wrap gap-2">
                      {msg.suggestedAction.type === 'filter_artist' && (
                        <button
                          onClick={() => {
                            onFilterArtist(msg.suggestedAction!.payload);
                            setIsOpen(false);
                          }}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#ff2e93] text-white hover:bg-[#e11d48] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000]"
                        >
                          ★ LOCATE // {msg.suggestedAction.payload.toUpperCase()}
                        </button>
                      )}

                      {msg.suggestedAction.type === 'open_cart' && (
                        <button
                          onClick={() => {
                            onOpenCart();
                            setIsOpen(false);
                          }}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#ffd60a] text-black hover:bg-[#fde047] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#000]"
                        >
                          ★ OPEN SHOWCASE BAG
                        </button>
                      )}

                      {msg.suggestedAction.payload === 'multimedia' && (
                        <a
                          href="#multimedia"
                          onClick={() => setIsOpen(false)}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#ccff00] text-black hover:bg-[#bef264] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer inline-block shadow-[2px_2px_0px_#000]"
                        >
                          ★ LAUNCH CINEMATHEQUE
                        </a>
                      )}

                      {msg.suggestedAction.payload === 'event' && (
                        <a
                          href="/event"
                          onClick={() => setIsOpen(false)}
                          style={{ borderRadius: '0px' }}
                          className="px-3 py-1.5 bg-[#00f0ff] text-black hover:bg-[#38bdf8] border-2 border-black font-black text-[10px] uppercase tracking-wider cursor-pointer inline-block shadow-[2px_2px_0px_#000]"
                        >
                          ★ ACCESS STADIUM CALENDAR
                        </a>
                      )}
                    </div>
                  )}

                  <span className="block text-[9px] mt-1.5 font-mono text-neutral-600 font-bold text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t-3 border-black flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="ENTER SYSTEM QUERY..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ borderRadius: '0px' }}
              className="flex-1 px-3 py-2 border-2 border-black text-xs font-mono uppercase bg-[#fdfbf7] focus:outline-none focus:bg-white focus:border-[#ff2e93]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{ borderRadius: '0px' }}
              className="px-4 py-2 bg-[#ff2e93] text-white font-black uppercase tracking-wider disabled:opacity-40 hover:bg-[#e11d48] transition-colors cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5"
            >
              [SEND →]
            </button>
          </form>
        </div>
      )}
    </>
  );
};

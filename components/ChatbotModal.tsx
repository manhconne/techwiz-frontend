'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, Send, X, Disc, Trash2, Sparkles, HelpCircle, Film, MapPin, ExternalLink } from 'lucide-react';

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
      text: 'Xin chào Fandom Stan! 💖 Tôi là Trợ Lý AI của Fan Hub Universe. Bạn cần tìm kiếm vé concert, xem trailer 4K, nghe podcast hay kiểm tra album bản quyền nào hôm nay?',
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
    if (q.includes('trailer') || q.includes('multimedia') || q.includes('podcast') || q.includes('đánh giá') || q.includes('rating') || q.includes('soundtrack')) {
      return {
        reply: 'Trung Tâm Đa Phương Tiện (Multimedia Center) đã sẵn sàng! Bạn có thể xem trailer 4K, video show thực tế, nghe podcast radio đĩa than xoay tròn, và tham gia chấm điểm 5 sao hoặc Thumbs up/down ngay tại khu vực Multimedia.',
        action: { type: 'view_album', payload: 'multimedia' },
      };
    }

    // 2. Location-Aware GPS & Meetup Map
    if (q.includes('vị trí') || q.includes('gps') || q.includes('bản đồ') || q.includes('gần đây') || q.includes('meetup') || q.includes('cafe')) {
      return {
        reply: 'Tính năng Radar Sự Kiện GPS tự động quét tọa độ hiện tại của bạn để tìm kiếm các buổi cup sleeve cafe, trade photocard và concert trong bán kính 10km - 100km! Bạn có thể xem ngay tại trang Sự Kiện & Lịch Lưu Diễn.',
        action: { type: 'view_album', payload: 'event' },
      };
    }

    // 3. NewJeans
    if (q.includes('newjeans') || q.includes('bunnies') || q.includes('supernatural') || q.includes('how sweet')) {
      return {
        reply: 'NewJeans đang gây bão với MV 4K "Supernatural" (kết hợp Pharrell Williams) và EP "Get Up" phiên bản Bunny Beach Bag! Bạn có muốn tôi lọc ngay sản phẩm NewJeans trên trang chủ không?',
        action: { type: 'filter_artist', payload: 'newjeans' },
      };
    }

    // 4. BLACKPINK
    if (q.includes('blackpink') || q.includes('blink') || q.includes('born pink')) {
      return {
        reply: 'BLACKPINK sở hữu album "BORN PINK" bản Limited Edition và Lightstick Hammer Bong Ver.2 chính hãng. Đêm diễn concert sân vận động Mỹ Đình cũng đã được ghi nhận trong lịch trình Fandom!',
        action: { type: 'filter_artist', payload: 'blackpink' },
      };
    }

    // 5. Concert Tickets
    if (q.includes('vé') || q.includes('ticket') || q.includes('concert') || q.includes('tour')) {
      return {
        reply: 'Lịch World Tour toàn cầu bao gồm SEVENTEEN [RIGHT HERE], BLACKPINK Encore, và concert Anh Trai Say Hi đã mở đăng ký giữ chỗ và link mua vé chính thức. Bạn hãy truy cập mục Event nhé!',
        action: { type: 'view_album', payload: 'event' },
      };
    }

    // 6. Fan-Submitted Articles
    if (q.includes('gửi bài') || q.includes('bài viết') || q.includes('đăng bài') || q.includes('cộng đồng')) {
      return {
        reply: 'Bạn có thể tự do gửi bài viết, cảm nhận concert, review album tại mục "Trending Articles & Release Schedule" bằng cách bấm nút "✍️ Gửi Bài Viết". Bài viết sẽ được Admin duyệt và đăng tải công khai!',
      };
    }

    // 7. Photocards authenticity
    if (q.includes('photocard') || q.includes('card') || q.includes('bo góc') || q.includes('auth')) {
      return {
        reply: '100% Album và vật phẩm trên Fan Hub Universe là hàng nguyên seal chính hãng nhập khẩu trực tiếp từ Seoul, đầy đủ quà tặng đặt trước (POB) và thẻ bo góc holographic được tính điểm trực tiếp vào bảng xếp hạng Hanteo & Circle Chart!',
      };
    }

    // 8. Showcase / Cart
    if (q.includes('cart') || q.includes('mua') || q.includes('thanh toán') || q.includes('giỏ hàng')) {
      return {
        reply: 'Hệ thống giỏ hàng hoạt động dưới mô hình Đăng Ký Giữ Chỗ Showcase (Pre-Order Reservation Alert). Hoàn toàn không thu phí trực tuyến nhằm đảm bảo quyền lợi trưng bày văn hóa fandom!',
        action: { type: 'open_cart', payload: '' },
      };
    }

    return {
      reply: `Cảm ơn bạn đã hỏi về "${userQuery}"! Fan Hub Universe cung cấp hệ sinh thái toàn diện: Trailer 4K, bản đồ GPS sự kiện, podcast đĩa than, và kho album chính hãng. Hãy chọn một trong các câu hỏi gợi ý bên dưới hoặc hỏi thêm bất cứ điều gì nhé!`,
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
    }, 400);
  };

  const promptSuggestions = [
    '🎬 Xem trailer 4K & đánh giá rating ở đâu?',
    '📍 Tìm sự kiện meetup gần tôi (Bản đồ GPS)?',
    '🎟️ Lịch concert SEVENTEEN & BTS sắp tới?',
    '✍️ Cách gửi bài viết chia sẻ fandom?',
    '💿 Thẻ bo góc photocards có chuẩn auth không?',
    '🌟 Gợi ý album NewJeans "Get Up"',
  ];

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 text-white rounded-full shadow-2xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2 group bg-slate-900 border border-slate-700"
        title="Mở Trợ Lý AI Fandom Assistant"
        type="button"
      >
        <Bot className="w-6 h-6 text-amber-400 animate-bounce" />
        <span className="hidden sm:inline text-xs font-black pr-1 tracking-wide">Fandom AI</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[580px] h-[540px] bg-white shadow-2xl border border-slate-300 rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-slate-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                <Bot className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>Trợ Lý Ảo Fan Hub AI</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">
                    24/7 LIVE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Giải đáp FAQ, gợi ý sự kiện &amp; nội dung thông minh</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Xóa lịch sử trò chuyện"
                type="button"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Đóng cửa sổ"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick FAQ Chips Bar */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-bold transition-all shadow-2xs cursor-pointer flex-shrink-0"
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                  {/* Contextual Action Button */}
                  {msg.suggestedAction && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                      {msg.suggestedAction.type === 'filter_artist' && (
                        <button
                          onClick={() => {
                            onFilterArtist(msg.suggestedAction!.payload);
                            setIsOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-300 shadow-xs"
                        >
                          <Disc className="w-3.5 h-3.5" />
                          <span>Lọc Album {msg.suggestedAction.payload.toUpperCase()}</span>
                        </button>
                      )}

                      {msg.suggestedAction.type === 'open_cart' && (
                        <button
                          onClick={() => {
                            onOpenCart();
                            setIsOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-slate-800"
                        >
                          <span>Mở Danh Sách Giữ Chỗ</span>
                        </button>
                      )}

                      {msg.suggestedAction.payload === 'multimedia' && (
                        <a
                          href="/multimedia"
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-rose-500 shadow-xs"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Đến Multimedia Center</span>
                        </a>
                      )}

                      {msg.suggestedAction.payload === 'event' && (
                        <a
                          href="/event#location-events"
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-500 shadow-xs"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Mở Bản Đồ Sự Kiện GPS</span>
                        </a>
                      )}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1 font-mono ${
                      msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                    }`}
                  >
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
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi (MV, vé concert, photocard, GPS)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-slate-900 text-white disabled:opacity-40 hover:bg-slate-800 transition-colors shadow-sm"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

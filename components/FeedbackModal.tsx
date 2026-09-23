'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<'bug' | 'suggestion' | 'query'>('suggestion');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white max-w-md w-full p-6 shadow-2xl border border-slate-200 relative"
        style={{ borderRadius: '8px' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div 
              className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto"
              style={{ width: '48px', height: '48px', borderRadius: '50%' }}
            >
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Thank You For Your Feedback!
            </h3>
            <p className="text-xs text-slate-500">
              Our platform team will review your message shortly to improve the fandom experience.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
                onClose();
              }}
              className="mt-4 px-6 py-2 text-white text-xs font-bold cursor-pointer"
              style={{ backgroundColor: '#0284c7', borderRadius: '8px' }}
              type="button"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-bold text-slate-800">
                Send Us Feedback
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Help us improve Fan Hub Plus. Share your album wishlist, bug reports, or feature ideas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Feedback Category
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCategory('bug')}
                    className="p-2 border text-center transition-all cursor-pointer"
                    style={{
                      borderColor: category === 'bug' ? '#ef4444' : '#e2e8f0',
                      backgroundColor: category === 'bug' ? '#fef2f2' : '#ffffff',
                      color: category === 'bug' ? '#b91c1c' : '#475569',
                      borderRadius: '8px',
                      fontWeight: category === 'bug' ? 700 : 500,
                    }}
                  >
                    Report Bug
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('suggestion')}
                    className="p-2 border text-center transition-all cursor-pointer"
                    style={{
                      borderColor: category === 'suggestion' ? '#0284c7' : '#e2e8f0',
                      backgroundColor: category === 'suggestion' ? '#f0f9ff' : '#ffffff',
                      color: category === 'suggestion' ? '#0284c7' : '#475569',
                      borderRadius: '8px',
                      fontWeight: category === 'suggestion' ? 700 : 500,
                    }}
                  >
                    Feature Idea
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('query')}
                    className="p-2 border text-center transition-all cursor-pointer"
                    style={{
                      borderColor: category === 'query' ? '#0284c7' : '#e2e8f0',
                      backgroundColor: category === 'query' ? '#f0f9ff' : '#ffffff',
                      color: category === 'query' ? '#0284c7' : '#475569',
                      borderRadius: '8px',
                      fontWeight: category === 'query' ? 700 : 500,
                    }}
                  >
                    General Query
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us your suggestions, desired artist drops, or feedback..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 focus:outline-none resize-none"
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                style={{ backgroundColor: '#0284c7', borderRadius: '8px' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

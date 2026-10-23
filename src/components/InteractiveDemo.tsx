'use client';

import { useState } from 'react';
import { Send, CheckCircle2, RotateCcw, Bot, User } from 'lucide-react';

interface DemoMessage {
  sender: 'bot' | 'user';
  text: string;
}

const DEMO_QUESTIONS = [
  { id: 1, text: "Hey there! 👋 What's your name?", type: 'text', placeholder: 'e.g. Alex Smith' },
  { id: 2, text: "Great to meet you! What is your email address?", type: 'email', placeholder: 'alex@example.com' },
  { id: 3, text: "What type of form are you looking to create?", type: 'choice', options: ['Customer Feedback', 'Lead Generation', 'Job Application', 'Other'] },
  { id: 4, text: "Would you like to embed this as a floating widget on your site?", type: 'yes_no' }
];

export default function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<DemoMessage[]>([
    { sender: 'bot', text: DEMO_QUESTIONS[0].text }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const updatedMessages: DemoMessage[] = [...messages, { sender: 'user', text }];
    setMessages(updatedMessages);
    setInputVal('');

    const nextStep = step + 1;
    if (nextStep < DEMO_QUESTIONS.length) {
      setStep(nextStep);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', text: DEMO_QUESTIONS[nextStep].text }]);
      }, 400);
    } else {
      setIsCompleted(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: '🎉 Awesome! That is how FormBot converts boring forms into fluid conversations.' }
        ]);
      }, 400);
    }
  };

  const handleReset = () => {
    setStep(0);
    setIsCompleted(false);
    setInputVal('');
    setMessages([{ sender: 'bot', text: DEMO_QUESTIONS[0].text }]);
  };

  const currentQ = DEMO_QUESTIONS[step];

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col h-[520px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold">FormBot Assistant</h4>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Interactive Demo
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          title="Restart Demo"
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input / Choice Area */}
      <div className="border-t border-slate-200 bg-white p-3">
        {isCompleted ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-800 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Form submitted successfully!
            </span>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
            >
              Reset
            </button>
          </div>
        ) : currentQ?.type === 'choice' ? (
          <div className="grid grid-cols-2 gap-2">
            {currentQ.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleSend(option)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                {option}
              </button>
            ))}
          </div>
        ) : currentQ?.type === 'yes_no' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleSend('Yes')}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => handleSend('No')}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="flex items-center gap-2"
          >
            <input
              type={currentQ?.type === 'email' ? 'email' : 'text'}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={currentQ?.placeholder || 'Type your message...'}
              className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
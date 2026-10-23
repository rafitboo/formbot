'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { FormWithQuestions, Question } from '@/lib/types';

interface ChatbotRunnerProps {
  form: FormWithQuestions;
  isWidget?: boolean;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export default function ChatbotRunner({ form, isWidget = false }: ChatbotRunnerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: form.welcome_message || 'Hi there! Please take a moment to fill out this quick form.',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const questions: Question[] = form.questions || [];

  // Show first question once after welcome message without duplicating in Strict Mode
  useEffect(() => {
    if (questions.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-q-${questions[0].id}`,
          sender: 'bot',
          text: questions[0].title,
        },
      ]);
    }
  }, [questions]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, errorMsg]);

  const currentQ: Question | undefined = questions[currentIndex];

  const validateInput = (val: string, q: Question): string | null => {
    const trimmed = val.trim();
    if (q.is_required && !trimmed) {
      return 'This question is required.';
    }
    if (q.question_type === 'email' && trimmed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid email address.';
      }
    }
    return null;
  };

  const submitFinalAnswers = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to record submission');
      }

      setIsComplete(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-completion-${Date.now()}`,
          sender: 'bot',
          text: form.completion_message || 'Thank you! Your response has been recorded.',
        },
      ]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setErrorMsg(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = (answerValue: string) => {
    if (!currentQ) return;

    const validationError = validateInput(answerValue, currentQ);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setErrorMsg('');
    const updatedAnswers = { ...answers, [currentQ.id]: answerValue };
    setAnswers(updatedAnswers);

    const updatedMessages: Message[] = [
      ...messages,
      { id: `user-ans-${currentQ.id}-${Date.now()}`, sender: 'user', text: answerValue },
    ];
    setMessages(updatedMessages);
    setInputValue('');

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-q-${questions[nextIndex].id}-${Date.now()}`,
            sender: 'bot',
            text: questions[nextIndex].title,
          },
        ]);
      }, 400);
    } else {
      submitFinalAnswers(updatedAnswers);
    }
  };

  const primaryColor = form.primary_color || '#2563eb';

  return (
    <div
      className={`flex flex-col bg-white overflow-hidden shadow-xl border border-slate-200 ${
        isWidget
          ? 'h-full w-full rounded-2xl'
          : 'h-[620px] w-full max-w-xl mx-auto rounded-2xl'
      }`}
    >
      {/* Header */}
      <div
        className="px-5 py-4 text-white flex items-center justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">{form.title}</h3>
            <p className="text-xs opacity-90">
              {isComplete
                ? 'Completed'
                : `Question ${Math.min(currentIndex + 1, questions.length)} of ${questions.length}`}
            </p>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
        {messages.map((m, idx) => (
          <div
            key={`${m.id}-${idx}`}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'bot' && (
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs ${
                m.sender === 'user'
                  ? 'text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
              }`}
              style={m.sender === 'user' ? { backgroundColor: primaryColor } : undefined}
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

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-600 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className="border-t border-slate-200 bg-white p-3.5">
        {isComplete ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Response recorded. Thank you!</span>
          </div>
        ) : isSubmitting ? (
          <div className="flex items-center justify-center gap-2 p-3 text-xs text-slate-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span>Submitting answers...</span>
          </div>
        ) : currentQ?.question_type === 'multiple_choice' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentQ.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : currentQ?.question_type === 'yes_no' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleAnswer('Yes')}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer('No')}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnswer(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type={currentQ?.question_type === 'email' ? 'email' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentQ?.question_type === 'email'
                  ? 'name@example.com'
                  : 'Type your message...'
              }
              className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
              autoFocus
            />
            <button
              type="submit"
              disabled={currentQ?.is_required ? !inputValue.trim() : false}
              style={{ backgroundColor: primaryColor }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white disabled:opacity-40 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
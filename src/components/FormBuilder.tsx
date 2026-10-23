'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Check,
  Palette,
  Settings,
  HelpCircle,
  Eye,
  Bot,
  ExternalLink,
  CheckCircle2,
  Send,
  User,
  Share2
} from 'lucide-react';
import { updateFormSettings, saveQuestionsBatch, toggleFormPublishStatus } from '@/app/actions/form-actions';
import { FormWithQuestions, Question, QuestionType } from '@/lib/types';

interface FormBuilderProps {
  initialForm: FormWithQuestions;
}

export default function FormBuilder({ initialForm }: FormBuilderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');

  // Form Settings State
  const [title, setTitle] = useState(initialForm.title);
  const [description, setDescription] = useState(initialForm.description || '');
  const [welcomeMessage, setWelcomeMessage] = useState(initialForm.welcome_message);
  const [completionMessage, setCompletionMessage] = useState(initialForm.completion_message);
  const [primaryColor, setPrimaryColor] = useState(initialForm.primary_color || '#2563eb');
  const [isPublished, setIsPublished] = useState(initialForm.is_published);

  // Questions State
  const [questions, setQuestions] = useState<Question[]>(initialForm.questions);

  // Preview interactive state
  const [previewStep, setPreviewStep] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<string[]>([]);
  const [previewInput, setPreviewInput] = useState('');
  const [previewDone, setPreviewDone] = useState(false);

  // Question Management Helpers
  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      form_id: initialForm.id,
      title: type === 'multiple_choice' ? 'Which of the following describes you?' : 'Your question here',
      question_type: type,
      order_index: questions.length,
      is_required: true,
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2', 'Option 3'] : [],
      created_at: new Date().toISOString(),
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('Forms require at least one question.');
      return;
    }
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const updated = [...questions];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setQuestions(updated);
  };

  const handleAddOption = (questionIndex: number) => {
    const q = questions[questionIndex];
    const updatedOptions = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`];
    handleUpdateQuestion(questionIndex, { options: updatedOptions });
  };

  const handleUpdateOption = (questionIndex: number, optIndex: number, text: string) => {
    const q = questions[questionIndex];
    const updatedOptions = [...(q.options || [])];
    updatedOptions[optIndex] = text;
    handleUpdateQuestion(questionIndex, { options: updatedOptions });
  };

  const handleDeleteOption = (questionIndex: number, optIndex: number) => {
    const q = questions[questionIndex];
    if (q.options.length <= 2) {
      alert('Multiple choice questions require at least 2 options.');
      return;
    }
    const updatedOptions = q.options.filter((_, i) => i !== optIndex);
    handleUpdateQuestion(questionIndex, { options: updatedOptions });
  };

  // Save All Changes
  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateFormSettings(initialForm.id, {
          title,
          description,
          welcome_message: welcomeMessage,
          completion_message: completionMessage,
          primary_color: primaryColor,
        });

        await saveQuestionsBatch(initialForm.id, questions);

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } catch (err) {
        alert('Failed to save changes. Please try again.');
      }
    });
  };

  const handleTogglePublish = () => {
    startTransition(async () => {
      await toggleFormPublishStatus(initialForm.id, isPublished);
      setIsPublished(!isPublished);
    });
  };

  // Preview interactive handlers
  const handlePreviewSubmit = (val: string) => {
    if (!val.trim()) return;
    const newAnswers = [...previewAnswers, val];
    setPreviewAnswers(newAnswers);
    setPreviewInput('');

    if (previewStep + 1 < questions.length) {
      setPreviewStep(previewStep + 1);
    } else {
      setPreviewDone(true);
    }
  };

  const handleResetPreview = () => {
    setPreviewStep(0);
    setPreviewAnswers([]);
    setPreviewInput('');
    setPreviewDone(false);
  };

  const currentPreviewQ = questions[previewStep];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-bold text-lg text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-hidden px-1 transition-colors"
                placeholder="Form Title"
              />
              <p className="text-xs text-slate-400 px-1">
                {questions.length} questions • {isPublished ? 'Published' : 'Draft'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePublish}
              disabled={isPending}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                isPublished
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isPublished ? 'Published' : 'Publish Form'}
            </button>

            {isPublished && (
              <Link
                href={`/forms/${initialForm.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Live URL</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            )}

            <button
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Builder Main Grid */}
      <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Editor Panels */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'questions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              Questions ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Settings className="h-4 w-4" />
              Bot Settings & Theme
            </button>
          </div>

          {/* QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {q.question_type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveQuestion(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveQuestion(idx, 'down')}
                        disabled={idx === questions.length - 1}
                        title="Move Down"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        title="Delete Question"
                        className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Title Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Question Prompt
                    </label>
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => handleUpdateQuestion(idx, { title: e.target.value })}
                      placeholder="e.g. What is your company name?"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Question Controls (Required toggle) */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={q.is_required}
                        onChange={(e) => handleUpdateQuestion(idx, { is_required: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      Required Question
                    </label>

                    <select
                      value={q.question_type}
                      onChange={(e) =>
                        handleUpdateQuestion(idx, {
                          question_type: e.target.value as QuestionType,
                          options:
                            e.target.value === 'multiple_choice'
                              ? q.options?.length
                                ? q.options
                                : ['Option 1', 'Option 2']
                              : [],
                        })
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
                    >
                      <option value="text">Short Text</option>
                      <option value="email">Email Address</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="yes_no">Yes / No</option>
                    </select>
                  </div>

                  {/* Multiple Choice Options Builder */}
                  {q.question_type === 'multiple_choice' && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <label className="block text-xs font-medium text-slate-600">Choice Options</label>
                      {q.options?.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateOption(idx, optIdx, e.target.value)}
                            className="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                            placeholder={`Option ${optIdx + 1}`}
                          />
                          <button
                            onClick={() => handleDeleteOption(idx, optIdx)}
                            className="p-1 text-slate-400 hover:text-red-500"
                            title="Remove Option"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddOption(idx)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 pt-1"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Question Buttons */}
              <div className="rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
                  Add New Question
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleAddQuestion('text')}
                    className="rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    + Short Text
                  </button>
                  <button
                    onClick={() => handleAddQuestion('email')}
                    className="rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    + Email
                  </button>
                  <button
                    onClick={() => handleAddQuestion('multiple_choice')}
                    className="rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    + Multiple Choice
                  </button>
                  <button
                    onClick={() => handleAddQuestion('yes_no')}
                    className="rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    + Yes / No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Form Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  placeholder="Optional internal note or form purpose."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Chatbot Welcome Message
                </label>
                <input
                  type="text"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
                <p className="mt-1 text-xs text-slate-400">
                  The initial greeting shown before questions begin.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Completion Message
                </label>
                <input
                  type="text"
                  value={completionMessage}
                  onChange={(e) => setCompletionMessage(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Displayed once all questions are successfully answered.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Widget Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded-md border border-slate-300 p-1"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono text-slate-800 uppercase focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Interactive Chatbot Preview */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-800">Live Preview</span>
            </div>
            <button
              onClick={handleResetPreview}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Restart Preview
            </button>
          </div>

          {/* Interactive Chatbot Container */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden flex flex-col h-[560px]">
            {/* Widget Header */}
            <div
              className="p-4 text-white flex items-center justify-between shadow-xs transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight">{title}</h4>
                  <p className="text-xs opacity-90">Conversational Form</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
              {/* Bot Welcome Message */}
              <div className="flex items-start gap-2.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-bl-xs bg-white border border-slate-200/80 px-4 py-2.5 text-xs text-slate-800 shadow-2xs leading-relaxed max-w-[85%]">
                  {welcomeMessage}
                </div>
              </div>

              {/* Previously Answered Questions */}
              {previewAnswers.map((ans, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-bl-xs bg-white border border-slate-200/80 px-4 py-2.5 text-xs text-slate-800 shadow-2xs leading-relaxed max-w-[85%]">
                      {questions[idx]?.title}
                    </div>
                  </div>

                  <div className="flex items-start justify-end gap-2.5">
                    <div
                      className="rounded-2xl rounded-br-xs px-4 py-2.5 text-xs text-white shadow-2xs leading-relaxed max-w-[85%]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {ans}
                    </div>
                  </div>
                </div>
              ))}

              {/* Current Question */}
              {!previewDone && currentPreviewQ && (
                <div className="flex items-start gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-xs bg-white border border-slate-200/80 px-4 py-2.5 text-xs text-slate-800 shadow-2xs leading-relaxed max-w-[85%]">
                    {currentPreviewQ.title}
                    {currentPreviewQ.is_required && (
                      <span className="text-red-500 ml-1 font-bold">*</span>
                    )}
                  </div>
                </div>
              )}

              {/* Completion Screen */}
              {previewDone && (
                <div className="flex items-start gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-xs bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800 shadow-2xs leading-relaxed max-w-[85%]">
                    {completionMessage}
                  </div>
                </div>
              )}
            </div>

            {/* Input / Option Controls */}
            <div className="border-t border-slate-200 bg-white p-3">
              {previewDone ? (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Preview completed
                  </span>
                  <button
                    onClick={handleResetPreview}
                    className="font-bold underline hover:text-emerald-900"
                  >
                    Reset
                  </button>
                </div>
              ) : currentPreviewQ?.question_type === 'multiple_choice' ? (
                <div className="grid grid-cols-2 gap-2">
                  {currentPreviewQ.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePreviewSubmit(opt)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : currentPreviewQ?.question_type === 'yes_no' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreviewSubmit('Yes')}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handlePreviewSubmit('No')}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePreviewSubmit(previewInput);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type={currentPreviewQ?.question_type === 'email' ? 'email' : 'text'}
                    value={previewInput}
                    onChange={(e) => setPreviewInput(e.target.value)}
                    placeholder={
                      currentPreviewQ?.question_type === 'email'
                        ? 'name@example.com'
                        : 'Type your answer...'
                    }
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={!previewInput.trim()}
                    style={{ backgroundColor: primaryColor }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white disabled:opacity-40 transition-opacity"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
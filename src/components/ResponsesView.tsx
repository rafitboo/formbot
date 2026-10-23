'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Copy,
  Check,
  Code2,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  EyeOff,
  CheckCircle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Form, Question } from '@/lib/types';
import { toggleFormPublishStatus } from '@/app/actions/form-actions';

interface SubmissionItem {
  id: string;
  submitted_at: string;
  answers: {
    question_id: string;
    question_title: string;
    question_type: string;
    value: string;
  }[];
}

interface ResponsesViewProps {
  form: Form;
  questions: Question[];
  submissions: SubmissionItem[];
}

export default function ResponsesView({
  form,
  questions,
  submissions,
}: ResponsesViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(
    submissions[0] || null
  );
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const publicUrl = `${origin}/forms/${form.id}`;
  const embedSnippet = `<script\n  src="${origin}/widget.js"\n  data-form-id="${form.id}"\n  data-host="${origin}"\n  async>\n</script>`;

  const handleTogglePublish = () => {
    startTransition(async () => {
      await toggleFormPublishStatus(form.id, form.is_published);
      router.refresh();
    });
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Export submissions to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;

    const headers = ['Submission ID', 'Submitted At', ...questions.map((q) => `"${q.title.replace(/"/g, '""')}"`)];
    const rows = submissions.map((sub) => {
      const rowAnswers = sub.answers.map((a) => `"${(a.value || '').replace(/"/g, '""')}"`);
      return [sub.id, new Date(sub.submitted_at).toISOString(), ...rowAnswers].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${form.title.toLowerCase().replace(/\s+/g, '_')}_submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-bold text-lg text-slate-900">{form.title}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Submissions & Analytics</span>
                <span>•</span>
                <span className="font-medium text-slate-700">{submissions.length} responses</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmbedModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Code2 className="h-3.5 w-3.5 text-blue-600" />
              Embed Widget
            </button>

            <button
              onClick={handleTogglePublish}
              disabled={isPending}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                form.is_published
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {form.is_published ? 'Published' : 'Draft'}
            </button>

            <Link
              href={`/builder/${form.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              Edit Form
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recorded Responses</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review answers submitted through your conversational chatbot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Export to CSV</span>
            </button>

            <Link
              href={`/forms/${form.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-500" />
              <span>Open Live Form</span>
            </Link>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No responses recorded yet</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              Share your public link or embed the widget to start gathering answers.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                {copiedUrl ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedUrl ? 'Copied Public Link' : 'Copy Public Link'}
              </button>
              <button
                onClick={() => setShowEmbedModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Code2 className="h-3.5 w-3.5" />
                Get Embed Snippet
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Submissions List Column */}
            <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="border-b border-slate-200 px-4 py-3 bg-slate-50/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Submissions ({submissions.length})
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
                {submissions.map((sub, index) => {
                  const isSelected = selectedSubmission?.id === sub.id;
                  const firstAnswer = sub.answers[0]?.value || 'Anonymous submission';

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className={`w-full p-4 text-left transition-colors flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50/70 border-l-4 border-blue-600'
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            #{submissions.length - index}
                          </span>
                          <span className="text-xs text-slate-400" suppressHydrationWarning>
                            {new Date(sub.submitted_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {firstAnswer}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span suppressHydrationWarning>{new Date(sub.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submission Detail Column */}
            <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white shadow-xs p-6 space-y-6">
              {selectedSubmission ? (
                <>
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Submission Details
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5" suppressHydrationWarning>
                        Received on {new Date(selectedSubmission.submitted_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Complete
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedSubmission.answers.map((ans, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-100 bg-slate-50/60 p-4 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Question {idx + 1}
                          </span>
                          <span className="text-2xs uppercase tracking-wider rounded bg-slate-200 px-1.5 py-0.5 text-slate-600 font-medium">
                            {ans.question_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {ans.question_title}
                        </p>
                        <div className="pt-2">
                          <p className="text-sm text-slate-800 rounded-md bg-white p-3 border border-slate-200 font-medium whitespace-pre-wrap">
                            {ans.value || <span className="text-slate-400 italic">No answer provided</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-20 text-center text-slate-400 text-sm">
                  Select a submission from the list to view full details.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Embed Code Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Embed Widget on External Website</h3>
              </div>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Copy and paste this snippet right before the closing <code>&lt;/body&gt;</code> tag of any external HTML website, WordPress site, or Webflow page. It injects a floating chatbot button.
            </p>

            <div className="relative rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
              <pre>{embedSnippet}</pre>
              <button
                onClick={handleCopySnippet}
                className="absolute top-3 right-3 rounded-md bg-blue-600 px-2.5 py-1 text-2xs font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                {copiedSnippet ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
              <Link
                href="/test-embed"
                target="_blank"
                className="text-blue-600 underline font-medium hover:text-blue-800"
              >
                Open interactive widget test page →
              </Link>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
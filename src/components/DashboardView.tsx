'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FileText,
  MessageSquare,
  ExternalLink,
  Trash2,
  CheckCircle,
  EyeOff,
  Copy,
  Check,
  Edit3,
  BarChart3,
  Bot
} from 'lucide-react';
import {
  createNewForm,
  toggleFormPublishStatus,
  deleteForm,
  type FormSummary
} from '@/app/actions/form-actions';

interface DashboardViewProps {
  initialForms: FormSummary[];
  totalForms: number;
  totalResponses: number;
}

export default function DashboardView({
  initialForms,
  totalForms,
  totalResponses,
}: DashboardViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const newFormId = await createNewForm();
        if (newFormId) {
          router.push(`/builder/${newFormId}`);
        }
      } catch (err) {
        alert('Failed to create a new form. Please check your Supabase connection.');
      }
    });
  };

  const handleTogglePublish = (formId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleFormPublishStatus(formId, currentStatus);
      router.refresh();
    });
  };

  const handleDelete = (formId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? All submissions will be permanently deleted.`)) {
      startTransition(async () => {
        await deleteForm(formId);
        router.refresh();
      });
    }
  };

  const handleCopyLink = (formId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareableUrl = `${origin}/forms/${formId}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <span>FormBot</span>
          </Link>

          <button
            onClick={handleCreate}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Form</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your conversational forms, track responses, and deploy chat widgets.
          </p>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Forms</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{totalForms}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Responses</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">{totalResponses}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <MessageSquare className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Avg. Responses / Form</p>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {totalForms > 0 ? (totalResponses / totalForms).toFixed(1) : '0'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 text-base">Your Forms</h2>
            <span className="text-xs text-slate-500">{initialForms.length} total</span>
          </div>

          {initialForms.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No forms yet</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                Create your first conversational form to start collecting responses through chatbot interactions.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreate}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Form
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {initialForms.map((form) => (
                <div
                  key={form.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-50/60 transition-colors gap-4"
                >
                  {/* Form Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/builder/${form.id}`}
                        className="text-base font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate"
                      >
                        {form.title}
                      </Link>
                      {form.is_published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {form.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span>{form.question_count} questions</span>
                      <span>•</span>
                      <span>{form.response_count} responses</span>
                      <span>•</span>
                      <span suppressHydrationWarning>Created {new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/builder/${form.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit Form
                    </Link>

                    <Link
                      href={`/responses/${form.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      Submissions ({form.response_count})
                    </Link>

                    <button
                      onClick={() => handleTogglePublish(form.id, form.is_published)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        form.is_published
                          ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {form.is_published ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => handleCopyLink(form.id)}
                      title="Copy Public Form URL"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {copiedId === form.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                          <span>Link</span>
                        </>
                      )}
                    </button>

                    {form.is_published && (
                      <Link
                        href={`/forms/${form.id}`}
                        target="_blank"
                        title="Open Public Chatbot Form"
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}

                    <button
                      onClick={() => handleDelete(form.id, form.title)}
                      disabled={isPending}
                      title="Delete Form"
                      className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
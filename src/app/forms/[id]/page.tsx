import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getFormWithQuestions } from '@/app/actions/form-actions';
import ChatbotRunner from '@/components/ChatbotRunner';
import Link from 'next/link';
import { Bot, AlertTriangle } from 'lucide-react';

interface PublicFormProps {
  params: Promise<{ id: string }>;
}

async function PublicFormContent({ params }: PublicFormProps) {
  const { id } = await params;
  const form = await getFormWithQuestions(id);

  if (!form) {
    notFound();
  }

  if (!form.is_published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Form is Unpublished</h2>
          <p className="text-sm text-slate-500 mb-6">
            This form is currently in draft mode and not accepting public responses.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: form.primary_color || '#2563eb' }}
          >
            <Bot className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm text-slate-800">{form.title}</span>
        </div>
        <span className="text-xs text-slate-400">Powered by FormBot</span>
      </div>

      <div className="w-full flex-1 flex items-center justify-center">
        <ChatbotRunner form={form} />
      </div>

      <footer className="text-center pt-4">
        <p className="text-xs text-slate-400">
          FormBot Conversational Forms • Protected with SSL
        </p>
      </footer>
    </div>
  );
}

export default function PublicFormPage(props: PublicFormProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <PublicFormContent {...props} />
    </Suspense>
  );
}
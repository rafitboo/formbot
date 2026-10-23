import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getFormWithQuestions } from '@/app/actions/form-actions';
import ChatbotRunner from '@/components/ChatbotRunner';

interface WidgetPageProps {
  params: Promise<{ id: string }>;
}

async function WidgetContent({ params }: WidgetPageProps) {
  const { id } = await params;
  const form = await getFormWithQuestions(id);

  if (!form || !form.is_published) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white p-4 text-center">
        <p className="text-sm text-slate-500">This form is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-transparent overflow-hidden">
      <ChatbotRunner form={form} isWidget={true} />
    </div>
  );
}

export default function WidgetPage(props: WidgetPageProps) {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-transparent" />}>
      <WidgetContent {...props} />
    </Suspense>
  );
}
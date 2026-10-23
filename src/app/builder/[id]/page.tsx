import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getFormWithQuestions } from '@/app/actions/form-actions';
import FormBuilder from '@/components/FormBuilder';

interface BuilderPageProps {
  params: Promise<{ id: string }>;
}

async function BuilderContent({ params }: BuilderPageProps) {
  const { id } = await params;
  const form = await getFormWithQuestions(id);

  if (!form) {
    notFound();
  }

  return <FormBuilder initialForm={form} />;
}

export default function BuilderPage(props: BuilderPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <BuilderContent {...props} />
    </Suspense>
  );
}
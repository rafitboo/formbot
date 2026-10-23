import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getFormSubmissions } from '@/app/actions/form-actions';
import ResponsesView from '@/components/ResponsesView';

interface ResponsesPageProps {
  params: Promise<{ id: string }>;
}

async function ResponsesContent({ params }: ResponsesPageProps) {
  const { id } = await params;
  const data = await getFormSubmissions(id);

  if (!data) {
    notFound();
  }

  return (
    <ResponsesView
      form={data.form}
      questions={data.questions}
      submissions={data.submissions}
    />
  );
}

export default function ResponsesPage(props: ResponsesPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <ResponsesContent {...props} />
    </Suspense>
  );
}
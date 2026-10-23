import { Suspense } from 'react';
import { getDashboardData } from '@/app/actions/form-actions';
import DashboardView from '@/components/DashboardView';

async function DashboardContent() {
  const { forms, totalForms, totalResponses } = await getDashboardData();

  return (
    <DashboardView
      initialForms={forms}
      totalForms={totalForms}
      totalResponses={totalResponses}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
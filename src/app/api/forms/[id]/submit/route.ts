import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise params (Next.js 15+) and standard params
    const resolvedParams = await context.params;
    const formId = resolvedParams.id;

    const body = await req.json();
    const { answers } = body as { answers: Record<string, string> };

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers payload' }, { status: 400 });
    }

    // 1. Verify form exists and is published
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, is_published')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      console.error('Submit API: Form not found for ID', formId, formError);
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    if (!form.is_published) {
      return NextResponse.json({ error: 'This form is not published.' }, { status: 403 });
    }

    // 2. Insert into responses table
    const { data: responseRecord, error: responseError } = await supabase
      .from('responses')
      .insert([{ form_id: formId }])
      .select('id')
      .single();

    if (responseError || !responseRecord) {
      console.error('Submit API: Error creating response session', responseError);
      return NextResponse.json({ error: 'Failed to record response' }, { status: 500 });
    }

    // 3. Insert answers
    const answersToInsert = Object.entries(answers).map(([questionId, value]) => ({
      response_id: responseRecord.id,
      question_id: questionId,
      value: String(value ?? ''),
    }));

    if (answersToInsert.length > 0) {
      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersToInsert);

      if (answersError) {
        console.error('Submit API: Error saving answers', answersError);
        return NextResponse.json({ error: 'Failed to save individual answers' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, responseId: responseRecord.id });
  } catch (err: unknown) {
    console.error('Submit API Error:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
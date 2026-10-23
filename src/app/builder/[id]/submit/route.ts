import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: formId } = await params;
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
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    if (!form.is_published) {
      return NextResponse.json({ error: 'This form is not accepting submissions.' }, { status: 403 });
    }

    // 2. Insert into responses table
    const { data: responseRecord, error: responseError } = await supabase
      .from('responses')
      .insert([{ form_id: formId }])
      .select('id')
      .single();

    if (responseError || !responseRecord) {
      return NextResponse.json({ error: 'Failed to record response session' }, { status: 500 });
    }

    // 3. Format and insert individual answers
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
        return NextResponse.json({ error: 'Failed to save answers' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, responseId: responseRecord.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
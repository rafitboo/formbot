'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface FormSummary {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  created_at: string;
  question_count: number;
  response_count: number;
}

export interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  forms: FormSummary[];
}

export async function getDashboardData(): Promise<DashboardStats> {
  // 1. Fetch all forms
  const { data: forms, error: formsError } = await supabase
    .from('forms')
    .select('id, title, description, is_published, created_at')
    .order('created_at', { ascending: false });

  if (formsError || !forms) {
    console.error('Error fetching forms:', formsError);
    return { totalForms: 0, totalResponses: 0, forms: [] };
  }

  // 2. Fetch total responses count across all forms
  const { count: totalResponsesCount } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true });

  // 3. Aggregate question count and response count per form
  const formsWithCounts: FormSummary[] = await Promise.all(
    forms.map(async (form) => {
      const [{ count: qCount }, { count: rCount }] = await Promise.all([
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('form_id', form.id),
        supabase
          .from('responses')
          .select('*', { count: 'exact', head: true })
          .eq('form_id', form.id),
      ]);

      return {
        ...form,
        question_count: qCount || 0,
        response_count: rCount || 0,
      };
    })
  );

  return {
    totalForms: forms.length,
    totalResponses: totalResponsesCount || 0,
    forms: formsWithCounts,
  };
}

export async function createNewForm() {
  const { data, error } = await supabase
    .from('forms')
    .insert([
      {
        title: 'Untitled Form',
        description: 'Collect feedback or user input with this conversational form.',
        is_published: false,
        welcome_message: 'Hi there! Please take a moment to fill out this quick form.',
        completion_message: 'Thank you! Your response has been recorded.',
        primary_color: '#2563eb',
      },
    ])
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create form: ${error.message}`);
  }

  // Add default starting questions to provide an intuitive template
  if (data?.id) {
    await supabase.from('questions').insert([
      {
        form_id: data.id,
        title: 'What is your full name?',
        question_type: 'text',
        order_index: 0,
        is_required: true,
        options: [],
      },
      {
        form_id: data.id,
        title: 'What is your email address?',
        question_type: 'email',
        order_index: 1,
        is_required: true,
        options: [],
      },
    ]);
  }

  revalidatePath('/dashboard');
  return data?.id;
}

export async function toggleFormPublishStatus(formId: string, currentStatus: boolean) {
  const { error } = await supabase
    .from('forms')
    .update({ is_published: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', formId);

  if (error) {
    throw new Error(`Failed to update form: ${error.message}`);
  }

  revalidatePath('/dashboard');
}

export async function deleteForm(formId: string) {
  const { error } = await supabase.from('forms').delete().eq('id', formId);

  if (error) {
    throw new Error(`Failed to delete form: ${error.message}`);
  }

  revalidatePath('/dashboard');
}

export async function getFormWithQuestions(formId: string) {
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single();

  if (formError || !form) {
    return null;
  }

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('form_id', formId)
    .order('order_index', { ascending: true });

  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
  }

  return {
    ...form,
    questions: questions || [],
  };
}

export async function updateFormSettings(
  formId: string,
  settings: {
    title: string;
    description: string;
    welcome_message: string;
    completion_message: string;
    primary_color: string;
  }
) {
  const { error } = await supabase
    .from('forms')
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', formId);

  if (error) {
    throw new Error(`Failed to update form settings: ${error.message}`);
  }

  revalidatePath(`/builder/${formId}`);
}

export async function saveQuestionsBatch(
  formId: string,
  questions: Array<{
    id?: string;
    title: string;
    question_type: string;
    order_index: number;
    is_required: boolean;
    options: string[];
  }>
) {
  // Delete existing questions for this form to maintain clean index ordering
  await supabase.from('questions').delete().eq('form_id', formId);

  const formattedQuestions = questions.map((q, idx) => ({
    form_id: formId,
    title: q.title || 'Untitled Question',
    question_type: q.question_type,
    order_index: idx,
    is_required: q.is_required,
    options: q.options || [],
  }));

  const { error } = await supabase.from('questions').insert(formattedQuestions);

  if (error) {
    throw new Error(`Failed to save questions: ${error.message}`);
  }

  revalidatePath(`/builder/${formId}`);
}

export async function getFormSubmissions(formId: string) {
  // 1. Fetch form info
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single();

  if (formError || !form) {
    return null;
  }

  // 2. Fetch form questions
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('form_id', formId)
    .order('order_index', { ascending: true });

  const questionList = questions || [];
  const questionMap = new Map(questionList.map((q) => [q.id, q]));

  // 3. Fetch submissions with answers
  const { data: responses, error: respError } = await supabase
    .from('responses')
    .select(`
      id,
      submitted_at,
      answers (
        id,
        question_id,
        value
      )
    `)
    .eq('form_id', formId)
    .order('submitted_at', { ascending: false });

  if (respError) {
    console.error('Error fetching responses:', respError);
  }

  // 4. Map answers cleanly with question titles and types
  const formattedSubmissions = (responses || []).map((resp) => {
    const rawAnswers = (resp.answers as Array<{ id: string; question_id: string; value: string }>) || [];
    
    const formattedAnswers = questionList.map((q) => {
      const match = rawAnswers.find((a) => a.question_id === q.id);
      return {
        question_id: q.id,
        question_title: q.title,
        question_type: q.question_type,
        value: match ? match.value : '—',
      };
    });

    return {
      id: resp.id,
      submitted_at: resp.submitted_at,
      answers: formattedAnswers,
    };
  });

  return {
    form,
    questions: questionList,
    submissions: formattedSubmissions,
  };
}
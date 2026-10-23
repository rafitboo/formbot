export type QuestionType = 'text' | 'email' | 'multiple_choice' | 'yes_no';

export interface Form {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  welcome_message: string;
  completion_message: string;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  form_id: string;
  title: string;
  question_type: QuestionType;
  order_index: number;
  is_required: boolean;
  options: string[];
  created_at: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  submitted_at: string;
}

export interface Answer {
  id: string;
  response_id: string;
  question_id: string;
  value: string;
  created_at: string;
}

export interface FormWithQuestions extends Form {
  questions: Question[];
}

export interface FormSubmissionDetail {
  id: string;
  submitted_at: string;
  answers: {
    question_id: string;
    question_title: string;
    question_type: QuestionType;
    value: string;
  }[];
}
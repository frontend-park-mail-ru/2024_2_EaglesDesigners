
export interface TSurveyQuestion {
  id: string;
  question: string;
  type: string;
}

export interface TSurveyAnswer {
  question_id: string;
  text_answer: string;
  numeric_answer: number;
}

export declare interface ReadingQuestion {
  pk: number;
  url: string;
  exercise: string;
  passage: number;
  number: number;
  question_type: 'multiple_choice' | 'true_false' | 'yes_no' | 'fill_blank',
  choices: string[];
  answers: string[];
}

declare interface _AnswerChoice {
  text: string;
  value: string;
}

export declare interface ReadingAnswer {
  question_number: ReadingQuestion['number'];
  content: string;
  question_type?: ReadingQuestion['question_type'];
  choices?: _AnswerChoice[];
}

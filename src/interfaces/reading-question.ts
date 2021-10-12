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

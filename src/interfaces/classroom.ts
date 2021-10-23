import { ClassroomReadingExercise } from './reading-exercise';
import { User } from './user'

export declare interface Classroom {
  pk: number;
  url: string;
  name: string;
  description: string;
  teacher: User;
  students: User[];
  reading_exercises: ClassroomReadingExercise[];
}


declare interface _ReadingExercise {
  pk: number;
  url: string;
  identifier: string;
}

export declare interface ReadingSubmissionResult {
  question_number: number;
  submitted_answer: string;
  possible_answers: string[];
  is_correct: boolean;
}

export declare interface ReadingExerciseReport {
  exercise: _ReadingExercise;
  time_taken: string;
  passage_1_total: number;
  passage_2_total: number;
  passage_3_total: number;
  total: number;
  band_score: number;
  submitted: boolean;
  passage_1_detail?: ReadingSubmissionResult[];
  passage_2_detail?: ReadingSubmissionResult[];
  passage_3_detail?: ReadingSubmissionResult[];
}

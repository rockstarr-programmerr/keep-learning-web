import { ReadingQuestion } from '../reading-question'
import { PaginatedRes } from './common';

export declare interface ReadingQuestionDetailRes extends ReadingQuestion {}

export declare interface ReadingQuestionListRes extends PaginatedRes {
  results: ReadingQuestionDetailRes[]
}

export declare interface ReadingQuestionCreateReq {
  exercise: ReadingQuestion['exercise'];
  passage: ReadingQuestion['passage'];
  number: ReadingQuestion['number'];
  question_type: ReadingQuestion['question_type'],
  choices: ReadingQuestion['choices'];
  answers: ReadingQuestion['answers'];
}

export declare interface ReadingQuestionUpdateReq extends ReadingQuestionCreateReq {}

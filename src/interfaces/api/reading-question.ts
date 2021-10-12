import { ReadingQuestion } from '../reading-question'
import { PaginatedRes } from './common';

export declare interface ReadingQuestionDetailRes extends ReadingQuestion {}

export declare interface ReadingQuestionListRes extends PaginatedRes {
  results: ReadingQuestionDetailRes[]
}

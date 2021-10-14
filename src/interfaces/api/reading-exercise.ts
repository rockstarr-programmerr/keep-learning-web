import { ReadingExercise } from '../reading-exercise'
import { PaginatedRes } from './common'
import { ReadingAnswer } from '../reading-question'

export declare interface ReadingExerciseDetailRes extends ReadingExercise {}

export declare interface ReadingExerciseListRes extends PaginatedRes {
  results: ReadingExerciseDetailRes[];
}

export declare interface ReadingExerciseCreateReq {
  identifier: string;
  content: string;
}


export declare interface ReadingExerciseUpdateReq {
  identifier: string;
  content: string;
}

export declare interface ReadingExerciseSubmitAnswersReq extends ReadingAnswer {}

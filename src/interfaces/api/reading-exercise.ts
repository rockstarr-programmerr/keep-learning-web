import { ReadingExercise } from "../reading-exercise";
import { PaginatedRes } from "./common";

export declare interface ReadingExerciseDetailRes extends ReadingExercise {}

export declare interface ReadingExerciseListRes extends PaginatedRes {
  results: ReadingExerciseDetailRes[];
}

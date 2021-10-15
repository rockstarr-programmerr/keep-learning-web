import { Classroom, ReadingExerciseReport } from '../classroom'
import { PaginatedRes } from './common'

export declare interface ClassroomDetailRes extends Classroom {}

export declare interface ClassroomListRes extends PaginatedRes {
  results: ClassroomDetailRes[];
}

export declare interface ClassroomCreateReq {
  name: string;
  description?: string;
}

export declare interface ClassroomUpdateReq extends ClassroomCreateReq {}

export declare interface AddStudentReq {
  name: string;
  email: string;
  phone_number?: string;
}

export declare interface RemoveStudentReq {
  email: string;
}

export declare interface AddReadingExercisesReq {
  pk: number;
}

export declare interface RemoveReadingExercisesReq {
  pk: number;
}

export declare interface ReadingExerciseReportRes extends ReadingExerciseReport {}

export declare interface GetStudentReportReq {
  student_pk: number;
  exercise_pk?: number;
  show_detail?: boolean;
}

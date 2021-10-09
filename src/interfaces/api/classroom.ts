import { Classroom } from '../classroom'
import { PaginatedRes } from './common'

export declare interface ClassroomDetailRes extends Classroom {}

export declare interface ClassroomListRes extends PaginatedRes {
  results: ClassroomDetailRes[];
}

export declare interface ClassroomCreateReq {
  name: string;
  description?: string;
}

export declare interface AddStudentReq {
  name: string;
  email: string;
  phone_number?: string;
}

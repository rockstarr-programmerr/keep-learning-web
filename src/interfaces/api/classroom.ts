import { Classroom } from '../classroom'
import { PaginatedRes } from './common'

export declare interface ClassroomDetailRes extends Classroom {}

export declare interface ClassroomListRes extends PaginatedRes {
  results: ClassroomDetailRes[];
}

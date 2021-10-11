import { User } from './user'

export declare interface Classroom {
  pk: number;
  url: string;
  name: string;
  description: string;
  teacher: User;
  students: User[];
  reading_exercises: number[];
}

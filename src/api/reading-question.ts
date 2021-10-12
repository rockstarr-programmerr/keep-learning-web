import { ReadingQuestionListRes } from '@/interfaces/api/reading-question'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import Vue from 'vue'
import { endpoints } from './endpoints'

export const readingQuestion = {
  async list (exercisePk: ReadingExercise['pk']): Promise<ReadingQuestionListRes> {
    const res = await Vue.axios.get(endpoints.readingQuestion.list, {
      params: {
        exercise: exercisePk
      }
    })
    return res.data
  }
}

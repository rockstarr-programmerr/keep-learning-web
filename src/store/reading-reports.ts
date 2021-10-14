import { Api } from '@/api'
import { Classroom, ReadingExerciseReport } from '@/interfaces/classroom'
import { ReadingExercise } from '@/interfaces/reading-exercise'
import { User } from '@/interfaces/user'
import { Module } from 'vuex'
import { RootState } from './index'

declare interface ReadingReportState {
  reports: ReadingExerciseReport[];
  currentReport?: ReadingExerciseReport;
}

export const readingReport: Module<ReadingReportState, RootState> = {
  namespaced: true,

  state: {
    reports: [],
    currentReport: undefined
  },

  mutations: {
    SET_REPORTS (state, reports) {
      state.reports = reports
    },

    SET_CURRENT_REPORT (state, exerciseID: ReadingExercise['identifier']) {
      state.currentReport = state.reports.find(report => report.exercise === exerciseID)
    }
  },

  actions: {
    async getReports (
      { commit },
      { classroomPk, studentPk }: { classroomPk: Classroom['pk'], studentPk: User['pk'] }
    ): Promise<void> {
      const data = await Api.classroom.getStudentReport(classroomPk, studentPk)
      commit('SET_REPORTS', data)
    }
  }
}

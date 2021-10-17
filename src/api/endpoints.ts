export const endpoints = {
  account: {
    users: {
      login: '/account/users/login/',
      tokenRefresh: '/account/users/token-refresh/',
      registerTeacher: '/account/users/register-teacher/',
      detail: '/account/users/<pk>/',
      changePassword: '/account/users/change-password/',
      emailResetPasswordLink: '/account/users/email-reset-password-link/',
      resetPassword: '/account/users/reset-password/'
    },
    me: {
      myInfo: '/account/me/',
      updateProfile: '/account/me/'
    }
  },
  classroom: {
    classroomList: '/classroom/classrooms/',
    classroomDetail: '/classroom/classrooms/<pk>/',
    classroomCreate: '/classroom/classrooms/',
    classroomUpdate: '/classroom/classrooms/<pk>/',
    classroomDelete: '/classroom/classrooms/<pk>/',
    addStudents: '/classroom/classrooms/<pk>/add-students/',
    removeStudents: '/classroom/classrooms/<pk>/remove-students/',
    addReadingExercises: '/classroom/classrooms/<pk>/add-reading-exercises/',
    removeReadingExercises: '/classroom/classrooms/<pk>/remove-reading-exercises/',
    studentReadingReport: '/classroom/classrooms/<pk>/student-reading-report/',
    resendPasswordEmail: '/classroom/classrooms/<pk>/resend-password-email/'
  },
  readingExercise: {
    list: '/classroom/reading-exercises/',
    detail: '/classroom/reading-exercises/<pk>/',
    create: '/classroom/reading-exercises/',
    update: '/classroom/reading-exercises/<pk>/',
    delete: '/classroom/reading-exercises/<pk>/',
    uploadImage: '/classroom/reading-exercises/upload-image/',
    submitAnswers: '/classroom/reading-exercises/<pk>/submit-answers/'
  },
  readingQuestion: {
    list: '/classroom/reading-questions/',
    create: '/classroom/reading-questions/',
    update: '/classroom/reading-questions/<pk>/',
    delete: '/classroom/reading-questions/<pk>/'
  }
}

export function replacePk (endpoint: string, pk: number): string {
  return endpoint.replace('<pk>', pk.toString())
}

export const endpoints = {
  account: {
    users: {
      login: '/account/users/login/',
      tokenRefresh: '/account/users/token-refresh/',
      registerTeacher: '/account/users/register-teacher/'
    },
    me: {
      myInfo: '/account/me/'
    }
  },
  classroom: {
    classroomList: '/classroom/classrooms/',
    classroomDetail: '/classroom/classrooms/<pk>/',
    classroomCreate: '/classroom/classrooms/',
    addStudents: '/classroom/classrooms/<pk>/add-students/',
    removeStudents: '/classroom/classrooms/<pk>/remove-students/',
    addReadingExercises: '/classroom/classrooms/<pk>/add-reading-exercises/',
    removeReadingExercises: '/classroom/classrooms/<pk>/remove-reading-exercises/'
  },
  readingExercise: {
    list: '/classroom/reading-exercises/',
    detail: '/classroom/reading-exercises/<pk>/',
    create: '/classroom/reading-exercises/',
    update: '/classroom/reading-exercises/<pk>/',
    uploadImage: '/classroom/reading-exercises/upload-image/'
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

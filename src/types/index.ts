export interface Question {
  question: string
  answer: string
  alternatives?: string[]
}

export interface Topic {
  name: string
  file: string
}

export interface TopicData {
  questions: Question[]
}

export interface TopicsConfig {
  topics: Topic[]
}

export type Direction = 'jp-to-en' | 'en-to-jp'
export type QuestionCount = 10 | 20 | 'all'

export interface QuizConfig {
  topic: Topic
  direction: Direction
  questionCount: QuestionCount
}

export interface QuizQuestion {
  prompt: string
  answer: string
  alternatives?: string[]
  userAnswer?: string
}

export interface QuizResult {
  question: QuizQuestion
  isCorrect: boolean
}

// Listening exercise types
export interface ListeningSentence {
  japanese: string
  english: string
  notes?: string
}

export interface ListeningExercise {
  name: string
  file: string
  description?: string
}

export interface ListeningExercisesConfig {
  exercises: ListeningExercise[]
}

export interface ListeningExerciseData {
  sentences: ListeningSentence[]
}

export interface ListeningQuizQuestion {
  japanese: string
  english: string
  notes?: string
  userAnswer?: string
}

// Numbers speed drill types
export type NumberDirection = 'num-to-jp' | 'jp-to-num'

export interface NumbersConfig {
  direction: NumberDirection
}

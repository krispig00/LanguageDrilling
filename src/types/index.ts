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
export type QuestionCount = 10 | 20

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

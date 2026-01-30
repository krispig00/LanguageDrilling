import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import QuizPage from '../components/QuizPage.vue'
import ResultsPage from '../components/ResultsPage.vue'
import ListeningQuizPage from '../components/ListeningQuizPage.vue'
import ListeningResultsPage from '../components/ListeningResultsPage.vue'
import NumbersSpeedDrillPage from '../components/NumbersSpeedDrillPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/quiz', name: 'quiz', component: QuizPage },
  { path: '/results', name: 'results', component: ResultsPage },
  { path: '/listening-quiz', name: 'listening-quiz', component: ListeningQuizPage },
  { path: '/listening-results', name: 'listening-results', component: ListeningResultsPage },
  { path: '/numbers-speed-drill', name: 'numbers-speed-drill', component: NumbersSpeedDrillPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

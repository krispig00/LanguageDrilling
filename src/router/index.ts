import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import QuizPage from '../components/QuizPage.vue'
import ResultsPage from '../components/ResultsPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/quiz', name: 'quiz', component: QuizPage },
  { path: '/results', name: 'results', component: ResultsPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import pinia from '../pinia'
import { useAccessStore } from '../stores/access'
import IntroView from '../views/IntroView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import Question1View from '../views/Question1View.vue'
import Question2View from '../views/Question2View.vue'
import Question3View from '../views/Question3View.vue'
import Question4View from '../views/Question4View.vue'
import Question5View from '../views/Question5View.vue'
import Question6View from '../views/Question6View.vue'
import FinalYesView from '../views/FinalYesView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: IntroView,
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView,
    },
    {
      path: '/q1',
      name: 'question-1',
      component: Question1View,
      meta: { requiresAccess: true, step: 1 },
    },
    {
      path: '/q2',
      name: 'question-2',
      component: Question2View,
      meta: { requiresAccess: true, step: 2 },
    },
    {
      path: '/q3',
      name: 'question-3',
      component: Question3View,
      meta: { requiresAccess: true, step: 3 },
    },
    {
      path: '/q4',
      name: 'question-4',
      component: Question4View,
      meta: { requiresAccess: true, step: 4 },
    },
    {
      path: '/q5',
      name: 'question-5',
      component: Question5View,
      meta: { requiresAccess: true, step: 5 },
    },
    {
      path: '/q6',
      name: 'question-6',
      component: Question6View,
      meta: { requiresAccess: true, step: 6 },
    },
    {
      path: '/yay',
      name: 'final-yes',
      component: FinalYesView,
      meta: { requiresAccess: true, step: 6 },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to) => {
  const accessStore = useAccessStore(pinia)
  const adminJump = sessionStorage.getItem('admin_jump') === '1'

  if (adminJump) {
    sessionStorage.removeItem('admin_jump')
    return true
  }

  if (to.meta.requiresAccess && !accessStore.checked) {
    return { name: 'intro' }
  }

  if (to.meta.requiresAccess && !accessStore.isAllowed) {
    return { name: 'access-denied' }
  }

  if (to.meta.step && accessStore.maxStep < to.meta.step) {
    return { name: 'question-1' }
  }

  if (to.name === 'intro' && accessStore.isAllowed) {
    return { name: 'question-1' }
  }

  return true
})

export default router

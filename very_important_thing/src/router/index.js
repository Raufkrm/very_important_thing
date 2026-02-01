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
      meta: { requiresAccess: true },
    },
    {
      path: '/q2',
      name: 'question-2',
      component: Question2View,
      meta: { requiresAccess: true },
    },
    {
      path: '/q3',
      name: 'question-3',
      component: Question3View,
      meta: { requiresAccess: true },
    },
    {
      path: '/q4',
      name: 'question-4',
      component: Question4View,
      meta: { requiresAccess: true },
    },
    {
      path: '/q5',
      name: 'question-5',
      component: Question5View,
      meta: { requiresAccess: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to) => {
  const accessStore = useAccessStore(pinia)

  if (to.meta.requiresAccess && !accessStore.checked) {
    return { name: 'intro' }
  }

  if (to.meta.requiresAccess && !accessStore.isAllowed) {
    return { name: 'access-denied' }
  }

  if (to.name === 'intro' && accessStore.isAllowed) {
    return { name: 'question-1' }
  }

  return true
})

export default router

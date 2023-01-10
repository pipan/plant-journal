import { createRouter, createWebHistory } from 'vue-router'
import CanvasView from '../views/CanvasView.vue'
import NavigationView from '../views/NavigationView.vue'
import PotModal from '../modals/PotModal.vue'
import WaterEventModal from '../modals/WaterEventModal.vue'
import FertilizeEventModal from '../modals/FertilizeEventModal.vue'
import PlantEventModal from '../modals/PlantEventModal.vue'
import CutEventModal from '../modals/CutEventModal.vue'
import CanvasEditModal from '../modals/CanvasEditModal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NavigationView,
      meta: { transition: 'animation-navigation' },
      children: [
        {
          path: 'zone/:id/edit',
          name: 'zone.edit',
          component: CanvasEditModal
        }
      ]
    },
    {
      path: '/zone/:id',
      name: 'zone',
      component: CanvasView,
      meta: { transition: 'animation-zone' },
      children: [
        {
          path: 'pot/new',
          name: 'pot.new',
          component: PotModal
        },
        {
          path: 'pot/:potId/event/water',
          name: 'event.water',
          component: WaterEventModal
        },
        {
          path: 'pot/:potId/event/fertilizer',
          name: 'event.fertilizer',
          component: FertilizeEventModal
        },
        {
          path: 'pot/:potId/event/plant',
          name: 'event.plant',
          component: PlantEventModal
        },
        {
          path: 'pot/:potId/event/cut',
          name: 'event.cut',
          component: CutEventModal
        }
      ]
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import CanvasView from '../views/CanvasView.vue'
import NavigationView from '../views/NavigationView.vue'
import PotView from '../views/PotView.vue'
import PotModal from '../modals/PotModal.vue'
import WaterEventModal from '../modals/WaterEventModal.vue'
import FertilizeEventModal from '../modals/FertilizeEventModal.vue'
import PlantEventModal from '../modals/PlantEventModal.vue'
import CutEventModal from '../modals/CutEventModal.vue'
import CanvasEditModal from '../modals/CanvasEditModal.vue'
import PlantEditModal from '../modals/PlantEditModal.vue'
import NoteEventModal from '../modals/NoteEventModal.vue'
import DeathEventModal from '../modals/DeathEventModal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NavigationView,
      meta: { transition: { canvas: 'animation-navigation' }, layer: 0 },
      children: [
        {
          path: 'canvas/:id/edit',
          name: 'canvas.edit',
          component: CanvasEditModal
        }
      ]
    },
    {
      path: '/canvas/:id',
      name: 'canvas',
      component: CanvasView,
      meta: { transition: { home: 'animation-canvas' }, layer: 1 },
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
        },
        {
          path: 'pot/:potId/event/note',
          name: 'event.note',
          component: NoteEventModal
        },
        {
          path: 'pot/:potId/event/death',
          name: 'event.death',
          component: DeathEventModal
        }
      ]
    },
    {
      path: '/pot/:id',
      name: 'pot',
      component: PotView,
      meta: { transition: '', layer: 2 },
      children: [
        {
          path: 'plant/:plantId/edit',
          name: 'plant.edit',
          component: PlantEditModal
        }
      ]
    }
  ]
})

export default router

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usePots } from './pots'

export const useCanvas = defineStore('canvas', () => {
  const pots = usePots()

  const items = ref([
    { index: 0, name: 'top left', pots: ref([]) },
    { index: 1, name: 'top', pots: ref([]) },
    { index: 2, name: 'top right', pots: ref([]) },
    { index: 3, name: 'left', pots: ref([]) },
    { index: 4, name: 'center', pots: ref([]) },
    { index: 5, name: 'right', pots: ref([]) },
    { index: 6, name: 'bottom left', pots: ref([]) },
    { index: 7, name: 'bottom', pots: ref([]) },
    { index: 8, name: 'bottom right', pots: ref([]) }
  ])

  function createPot(canvasIndex, pot) {
    pots.insertPot(pot)
    linkPot(canvasIndex, pot.id)
  }

  function edit(canvasIndex, data) {
    items.value[canvasIndex] = Object.assign({}, items.value[canvasIndex], data)
  }

  function linkPot(canvasIndex, potId) {
    items.value[canvasIndex].pots.push(potId)
  }

  return { items, createPot, edit }
})

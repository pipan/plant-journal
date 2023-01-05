import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCanvas = defineStore('canvas', () => {
  const items = ref([
    { index: 0, plants: ref([]) },
    { index: 1, plants: ref([]) },
    { index: 2, plants: ref([]) },
    { index: 3, plants: ref([]) },
    { index: 4, plants: ref([]) },
    { index: 5, plants: ref([]) },
    { index: 6, plants: ref([]) },
    { index: 7, plants: ref([]) },
    { index: 8, plants: ref([]) }
  ])
  
  function insertPlant(index, plant) {
    items.value[index].plants.push(plant)
  }

  return { items, insertPlant }
})

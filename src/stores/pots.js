import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePots = defineStore('pots', () => {
  const items = ref({})

  function insertPot(pot) {
    pot.id = nextId()
    items.value[pot.id] = pot
    return pot.id
  }

  function nextId() {
    let id = ''
    do {
        const idInt = Math.round(Math.random() * Math.pow(2, 64))
        id = toHex(idInt)
    } while (items.value[id] !== undefined)
    return id
  }

  function toHex(value) {
    const hexList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    let result = ''
    while (value > 0) {
        const remainder = value % 16
        result = hexList[remainder] + result
        value = Math.floor(value / 16)
    }
    return result
  }

  return { items, insertPot }
})

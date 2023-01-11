<script setup>
import { reactive } from '@vue/reactivity'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useCanvas } from './stores/canvas'

const canvas = useCanvas()

const router = useRouter()

const data = reactive({
    zoneId: 0,
    transition: ''
})

router.beforeEach((to, from) => {
  if (from.meta.layer < to.meta.layer) {
    data.transition = 'animation-view'
  } else {
    data.transition = 'animation-view-back'
  }
  if (to.meta.transition && to.meta.transition[from.name]) {
    data.transition = to.meta.transition[from.name]
  }
  data.zoneId = to.params.id || from.params.id
})

canvas.createPot(0, { name: 'one', x: 0, y: 0, color: 'red', shape: 'circle' })
canvas.createPot(0, { name: 'two', x: 0.1, y: 0.3, color: 'orange', shape: 'square' })
canvas.createPot(0, { name: 'THREE', x: 0.5, y: 0.5, color: 'purple', shape: 'rectangle' })
canvas.createPot(1, { name: 'four the best', x: 0, y: 0, color: 'red', shape: 'circle' })
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition :name="data.transition" :class="'origin--' + data.zoneId" duration="300">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<style scoped>

</style>
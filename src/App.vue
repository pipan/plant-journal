<script setup>
import { reactive } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
    zoneId: 0,
    transition: '',
    orientationAngle: 0
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

function setOrientation() {
  data.orientationAngle = screen.orientation.angle
}

onMounted(() => {
  screen.orientation.addEventListener('change', setOrientation)
})

onUnmounted(() => {
  screen.orientation.removeEventListener('change', setOrientation)
})

</script>

<template>
  <router-view v-slot="{ Component }" :class="'orientation-' + data.orientationAngle">
    <transition :name="data.transition" :class="'origin--' + data.zoneId" duration="300">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<style scoped>

</style>
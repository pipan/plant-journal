<script setup>
import { reactive } from '@vue/reactivity'
import { RouterLink, RouterView, useRouter } from 'vue-router'

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
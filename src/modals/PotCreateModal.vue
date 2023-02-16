<script setup>
import PotModal from './PotModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePotRepository } from '../repository/pot.repository'

const potRepository = usePotRepository()
const route = useRoute()
const router = useRouter()

function create(data) {
    const pot = {
        canvasId: parseInt(route.params.id),
        name: data.name,
        volume: data.volume,
        hue: data.hue,
        shape: data.shape,
        x: parseFloat(route.query.x),
        y: parseFloat(route.query.y)
    }
    potRepository.insert(pot).then(() => {
        close()
    })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'canvas' })
    }
    router.go(-1)
}
</script>

<template>
    <pot-modal @close="close()" @submit="create($event)"></pot-modal>
</template>

<style scoped>
</style>

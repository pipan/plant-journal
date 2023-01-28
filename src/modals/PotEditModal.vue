<script setup>
import PotModal from './PotModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePotRepository } from '../repository/pot.repository'
import { onMounted, reactive } from '@vue/runtime-core'

const potRepository = usePotRepository()
const route = useRoute()
const router = useRouter()

const data = reactive({
    pot: null
})

function create(data) {
    const potId = parseInt(route.params.potId)
    potRepository.patch(potId, data).then(() => {
        this.close()
    })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'zone' })
    }
    router.go(-1)
}

onMounted(() => {
    const id = parseInt(route.params.potId)
    potRepository.select(id).then((pot) => {
        data.pot = pot
    })
})
</script>

<template>
    <pot-modal v-if="data.pot" :pot="data.pot" @close="close()" @submit="create($event)"></pot-modal>
</template>

<style scoped>
</style>

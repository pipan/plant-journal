<script setup>
import PotModal from './PotModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePotRepository } from '../repository/pot.repository'
import { onMounted, reactive } from '@vue/runtime-core'
import { usePot } from '../services/pot'

const potRepository = usePotRepository()
const potService = usePot()
const route = useRoute()
const router = useRouter()

const data = reactive({
    pot: null
})

function create(data) {
    const potId = parseInt(route.params.potId)
    potRepository.patch(potId, data).then(() => {
        close()
    })
}

function manage(eventData) {
    const potId = parseInt(route.params.potId)
    let promises = []
    if (eventData.action == 'archive') {
        const promise = potService.archive(potId)
        promises.push(promise)
    }
    if (eventData.action == 'recover') {
        const promise = potService.recover(potId)
        promises.push(promise)
    }
    if (eventData.action == 'delete') {
        const promise = potService.remove(potId)
        promises.push(promise)
    }

    const canvasIdInt = parseInt(eventData.canvasId)
    if (canvasIdInt && canvasIdInt !== data.pot.canvasId) {
        const promise = potRepository.patch(potId, { canvasId: canvasIdInt })
        promises.push(promise)
    }

    if (promises.length === 0) {
        return
    }
    Promise.all(promises).then(() => { close() })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'canvas' })
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
    <pot-modal v-if="data.pot"
        :pot="data.pot"
        :canManage="true"
        @close="close()"
        @submit="create($event)"
        @manage="manage($event)"></pot-modal>
</template>

<style scoped>
</style>

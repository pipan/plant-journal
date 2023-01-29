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

function manage(data) {
    const potId = parseInt(route.params.potId)
    if (data.action == 'archive') {
        potService.archive(potId).then(() => {
            close()
        })
    } else if (data.action == 'delete') {
        potService.remove(potId).then(() => {
            close()
        })
    }
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

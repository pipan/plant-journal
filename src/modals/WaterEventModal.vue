<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import VolumeInput from '../components/VolumeInput.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePot } from '../services/pot'
import { onMounted } from '@vue/runtime-core'
import { usePlantRepository } from '../repository/plant.repository'

const router = useRouter()
const route = useRoute()
const potService = usePot()
const plantsRepository = usePlantRepository()

const data = reactive({
    volume: 800,
    datetime: new Date(),
    datetimeVisible: false,
    plants: []
})

function create() {
    const potId = parseInt(route.params.potId)
    potService.water(potId, { volume: data.volume, createdAt: data.datetimeVisible ? data.datetime : new Date() }).then(() => {
        close()
    })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'canvas' })
    }
    router.go(-1)
}

onMounted(() => {
    const potId = parseInt(route.params.potId)
    plantsRepository.selectActiveByPot(potId).then((plants) => {
        data.plants = plants
    })
})
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m column gap-l">
        <div class="pos-r row row--center row--middle">
            <i class="icon icon-water-drop icon--l color-water"></i>
            <button type="button" class="pos-a pos-right btn-icon" :class="{'btn-icon--active': data.datetimeVisible}" @click="data.datetimeVisible = !data.datetimeVisible">
                <i class="icon icon-clock icon--l"></i>
            </button>
        </div>
        <transition name="animation-row" duration="300">
            <datetime-input v-if="data.datetimeVisible"
                :value="data.datetime"
                @change="data.datetime = $event"></datetime-input>
        </transition>
        <div class="row row--center gap-l">
            <volume-input :value="data.volume" @change="data.volume = $event"></volume-input>
        </div>
        <div class="row row--center row--middle text-warn" v-if="data.plants.length === 0">
            <i class="icon icon--l icon-trowel px-s"></i>This pot needs plants
        </div>
        <div class="row row--center gap-l">
            <button type="button" class="btn-circle" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
            <button type="button" class="btn-circle btn-circle--primary" @click="create()" :disabled="data.plants.length === 0">
                <i class="icon icon--l icon-check"></i>
            </button>
        </div>
    </div>
</modal>
</template>

<style scoped>
.icon-water-drop {
    color: var(--color-value);
}
</style>

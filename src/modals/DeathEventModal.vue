<script setup>
import { reactive, ref } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import PlantSelect from '../components/PlantSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlantRepository } from '../repository/plant.repository'
import { onMounted } from '@vue/runtime-core'
import { usePlant } from '../services/plant'

const plantRepository = usePlantRepository()
const plantService = usePlant()
const router = useRouter()
const route = useRoute()

const data = reactive({
    datetime: new Date(),
    datetimeVisible: false,
    plants: [],
    selectedPlants: []
})

function create() {
    let event = {
        createdAt: data.datetimeVisible ? data.datetime : new Date()
    }
    plantService.death(data.selectedPlants, event).then(() => {
        this.close()
    })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'canvas' })
    }
    router.go(-1)
}

function load () {
    const id = parseInt(route.params.potId)
    plantRepository.selectActiveByPot(id).then((plants) => {
        data.plants = plants
    })
}

onMounted(() => {
    load()
})
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m column gap-l">
        <div class="pos-r row row--center row--middle">
            <i class="icon icon-skull icon--l color-skull"></i>
            <button type="button" class="pos-a pos-right btn-icon" :class="{'btn-icon--active': data.datetimeVisible}" @click="data.datetimeVisible = !data.datetimeVisible">
                <i class="icon icon-clock icon--l"></i>
            </button>
        </div>
        <transition name="animation-row" duration="220">
            <datetime-input v-if="data.datetimeVisible"
                :value="data.datetime"
                @change="data.datetime = $event"></datetime-input>
        </transition>
        <plant-select align="center" :options="data.plants" :value="data.selectedPlants" @change="data.selectedPlants = $event"></plant-select>
        <div class="row row--center gap-l">
            <button type="button" class="btn-circle" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
            <button type="button" class="btn-circle btn-circle--primary" @click="create()">
                <i class="icon icon--l icon-check"></i>
            </button>
        </div>
    </div>
</modal>
</template>

<style scoped>
.icon-skull {
    color: var(--color-value);
}
</style>

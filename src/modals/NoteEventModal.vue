<script setup>
import { reactive, ref } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import PlantSelect from '../components/PlantSelect.vue'
import InputField from '../components/InputField.vue'
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
    selectedPlants: [],
    note: ''
})

function create() {
    if (data.selectedPlants.length === 0) {
        return
    }
    let event = {
        createdAt: data.datetimeVisible ? data.datetime : new Date(),
        note: data.note
    }
    plantService.note(data.selectedPlants, event).then(() => {
        close()
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
    <form class="p-m column gap-l" @submit.prevent="create()">
        <div class="pos-r row row--center row--middle">
            <i class="icon icon-note icon--l color-note"></i>
            <button type="button" class="pos-a pos-right btn-icon" :class="{'btn-icon--active': data.datetimeVisible}" @click="data.datetimeVisible = !data.datetimeVisible">
                <i class="icon icon-clock icon--l"></i>
            </button>
        </div>
        <transition name="animation-row" duration="220">
            <datetime-input v-if="data.datetimeVisible"
                :value="data.datetime"
                @change="data.datetime = $event"></datetime-input>
        </transition>
        <plant-select align="center" v-if="data.plants.length > 0"
            :options="data.plants"
            :value="data.selectedPlants"
            @change="data.selectedPlants = $event"></plant-select>
        <input-field placeholder="Note" :value="data.note" @change="data.note = $event"></input-field>
        <div class="row row--center row--middle text-warn" v-if="data.plants.length === 0">
            <i class="icon icon--l icon-trowel px-s"></i>This pot needs plants
        </div>
        <div class="row row--center gap-l">
            <button type="button" class="btn-circle" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
            <button type="submit" class="btn-circle btn-circle--primary" :disabled="data.selectedPlants.length === 0">
                <i class="icon icon--l icon-check"></i>
            </button>
        </div>
    </form>
</modal>
</template>

<style scoped>
.icon-note {
    color: var(--color-value);
}
</style>

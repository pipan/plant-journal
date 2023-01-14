<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import InputField from '../components/InputField.vue'
import RadioSelect from '../components/RadioSelect.vue'
import NumberInput from '../components/NumberInput.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
    datetime: new Date(),
    datetimeVisible: false,
    plantId: 'seed',
    count: 1,
    plantOptions: [{ id: 'seed', name: 'seed' }, { id: 'cutting', name: 'cutting' }, { id: 'plant', name: 'plant' }]
})

const emit = defineEmits(['submit'])

function create() {
    emit('submit', {})
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'zone' })
    }
    router.go(-1)
}
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m column gap-l">
        <div class="pos-r row row--center row--middle">
            <i class="icon icon-trowel icon--l"></i>
            <button type="button" class="pos-a pos-right btn-icon" :class="{'btn-icon--active': data.datetimeVisible}" @click="data.datetimeVisible = !data.datetimeVisible">
                <i class="icon icon-clock icon--l"></i>
            </button>
        </div>
        <transition name="animation-row" duration="220">
            <datetime-input v-if="data.datetimeVisible"
                :value="data.datetime"
                @change="data.datetime = $event"></datetime-input>
        </transition>
        <input-field placeholder="Plant name" :value="data.plant" @change="data.plant = $event"></input-field>
        <radio-select :options="data.plantOptions" :value="data.plantId" @change="data.plantId = $event"></radio-select>
        <div class="row row--center">
            <number-input :value="data.count" @change="data.count = $event" :max="20"></number-input>
        </div>
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

</style>

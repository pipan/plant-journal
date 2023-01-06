<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import InputField from '../components/InputField.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
    datetime: new Date(),
    datetimeVisible: false,
    plant: ''
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
        <input-field placeholder="Plant" :value="data.plant" @change="data.plant = $event"></input-field>
        <div class="row row--center gap-l">
            <div class="column column--center gap-s">
                <label for="plant-seed">Seed</label>
                <input type="radio" id="plant-seed" name="plant" value="seed" />
            </div>
            <div class="column column--center gap-s">
                <label for="plant-cutting">Cutting</label>
                <input type="radio" id="plant-cutting" name="plant" value="cutting" />
            </div>
            <div class="column column--center gap-s">
                <label for="plant-plant">Plant</label>
                <input type="radio" id="plant-plant" name="plant" value="plant" />
            </div>
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

<script setup>
import { reactive, ref } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import InputField from '../components/InputField.vue'
import CircleSlider from '../components/CircleSlider.vue'
import NumberInput from '../components/NumberInput.vue'
import VolumeInput from '../components/VolumeInput.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
    n: 1,
    p: 1,
    k: 1,
    volume: 20,
    datetimeVisible: false,
    datetime: new Date()
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
            <i class="icon icon-fertilizer icon--l"></i>
            <button type="button" class="pos-a pos-right btn-icon" :class="{'btn-icon--active': data.datetimeVisible}" @click="data.datetimeVisible = !data.datetimeVisible">
                <i class="icon icon-clock icon--l"></i>
            </button>
        </div>
        <datetime-input v-if="data.datetimeVisible"
            :value="data.datetime"
            @change="data.datetime = $event"></datetime-input>
        <div class="row row--center gap-l">
            <number-input :value="data.n" @change="data.n = $event"></number-input>
            <number-input :value="data.p" @change="data.p = $event"></number-input>
            <number-input :value="data.k" @change="data.k = $event"></number-input>
        </div>
        <div class="row row--center gap-l">
            <volume-input :value="data.volume" @change="data.volume = $event"></volume-input>
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

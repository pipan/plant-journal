<script setup>
import { reactive, ref } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import InputField from '../components/InputField.vue'
import CircleSlider from '../components/CircleSlider.vue'
import NumberInput from '../components/NumberInput.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import { useRouter } from 'vue-router'
import { useScale } from '../services/scale'
import { computed } from '@vue/runtime-core'

const router = useRouter()
const scale = useScale([0.0, 0.25, 0.5, 0.75, 1.0], [0, 20, 100, 500, 3000])

const data = reactive({
    n: 1,
    p: 1,
    k: 1,
    volumeNorm: scale.norm(0),
    datetimeVisible: false,
    datetime: new Date()
})

const volume = computed(() => {
    return scale.mapRound(data.volumeNorm, [1, 5, 20, 100])
})

const volumeUnit = computed(() => {
    return volume.value >= 1000 ? 'kg' : 'g'
})

const volumeDisplayValue = computed(() => {
    return volume.value >= 1000 ? (Math.round(volume.value / 10) / 100).toFixed(2) : volume.value
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
        <transition name="animation-row" duration="220">
            <datetime-input v-if="data.datetimeVisible"
                :value="data.datetime"
                @change="data.datetime = $event"></datetime-input>
        </transition>
        <div class="row row--center gap-l">
            <number-input :value="data.n" @change="data.n = $event"></number-input>
            <number-input :value="data.p" @change="data.p = $event"></number-input>
            <number-input :value="data.k" @change="data.k = $event"></number-input>
        </div>
        <div class="row row--center gap-l">
            <circle-slider :value="data.volumeNorm" @change="data.volumeNorm = $event" :step="1">
                <div class="column column--center">
                    <div>{{ volumeDisplayValue }}</div>
                    <div class="text-s text-secondary">{{ volumeUnit }}</div>
                </div>
            </circle-slider> 
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

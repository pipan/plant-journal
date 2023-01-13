<script setup>
import { reactive } from '@vue/reactivity'
import InputField from './InputField.vue'
import CircleSlider from './CircleSlider.vue'
import CircleStepInput from './CircleStepInput.vue'
import { computed, onMounted } from '@vue/runtime-core'
import { normMap, stepRound } from '../services/units'

const emit = defineEmits(['change'])

const props = defineProps({
    value: { type: Date, default: () => { return new Date() } },
})

const data = reactive({
    time: 0.0,
    date: 0.0,
    year: 0.0
})

const time = computed(() => {
    return props.value.toLocaleTimeString(window.navigator.language, { hour: '2-digit', minute: '2-digit', hour12: false })
})
const year = computed(() => {
    return props.value.toLocaleDateString(window.navigator.language, { year: 'numeric' })
})
const month = computed(() => {
    return props.value.toLocaleDateString(window.navigator.language, { month: 'short' })
})
const day = computed(() => {
    return props.value.toLocaleDateString(window.navigator.language, { day: '2-digit' })
})

function setValue(value) {
    if (props.value.getTime() == value.getTime()) {
        return
    }
    emit('change', value)
}

function setYear(value) {
    data.year = value
    const valueYears = 2000 + Math.round(value * 100)
    const newValue = new Date(props.value)
    newValue.setYear(valueYears)
    setValue(newValue)
}

function setDate(value) {
    data.date = value
    const yearDiff = new Date(props.value.getFullYear() + 1, 0, 0, 0, 0, 0, 0).getTime() - new Date(props.value.getFullYear(), 0, 0, 0, 0, 0, 0).getTime()
    const yearDays = yearDiff / (1000 * 60 * 60 * 24)
    const newValue = new Date(props.value)
    newValue.setMonth(0)
    newValue.setDate(1 + Math.round(value * (yearDays - 1)))
    setValue(newValue)
}

function setTime(value) {
    data.time = value
    const valueMinutes = stepRound(value * 24 * 60, 15) 
    const newValue = new Date(props.value)
    newValue.setHours(Math.floor(valueMinutes / 60) % 24, valueMinutes % 60, 0, 0)
    setValue(newValue)
}

onMounted(() => {
    const yearDiff = new Date(props.value.getFullYear() + 1, 0, 0, 0, 0, 0, 0).getTime() - new Date(props.value.getFullYear(), 0, 0, 0, 0, 0, 0).getTime()
    const valueDiff = props.value.getTime() - new Date(props.value.getFullYear(), 0, 0, 0, 0, 0, 0).getTime()
    data.time = normMap(props.value.getHours() * 60 + props.value.getMinutes(), 0, 24 * 60)
    data.date = normMap(valueDiff / (1000 * 60 * 60 * 24), 0, yearDiff / (1000 * 60 * 60 * 24))
    data.year = normMap(props.value.getFullYear(), 2000, 2100)
})
</script>

<template>
<div class="row row--center gap-l">
    <circle-slider :value="data.year" @change="setYear($event)" :step="0.5">{{ year }}</circle-slider>
    <circle-slider :value="data.date" @change="setDate($event)" :step="0.25">
        <div class="column column--center">
            <div>{{ day }}</div>
            <div class="text-secondary text-s">{{ month }}</div>
        </div>
    </circle-slider>
    <circle-slider :value="data.time" @change="setTime($event)" :step="1">{{ time }}</circle-slider>
</div>
</template>

<style scoped>
.input-field {
    position: relative;
    width: 100%;
}

.input-field::before {
    content: '';
    position: absolute;
    bottom: 0px;
    width: 25%;
    height: 1px;
    background-color: var(--color-border);
    transform: translateX(150%);
    transition: width 120ms ease-out, transform 120ms ease-in, background-color 120ms ease;
}

.input-field.input-field--focus::before {
    width: 100%;
    transform: translateX(0%);
    transition: width 120ms ease-in, transform 120ms ease-out, background-color 120ms ease;
    background-color: var(--color-highlight-primary);
}

.input-field:hover::before {
    background-color: var(--color-highlight-primary);
}

.input-field input {
    box-sizing: border-box;
    width: 100%;
    padding: var(--unit-s);
    border: none;
    background-color: transparent;
    text-align: center;
    color: var(--color-fg);
    outline: none;
    font-size: 16px;
}
</style>
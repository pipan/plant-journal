<script setup>
import { reactive } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import CircleSlider from './CircleSlider.vue'

const data = reactive({
    sliderValue: 0.0
})

const props = defineProps({
    value: { type: Number },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 9 },
    step: { type: Number, default: 1 },
    sensitivity: { type: Number, default: 3 },
    sufix: { type: String, default: '' },
    label: { type: String, default: '' }
})

const emit = defineEmits(['change'])

function onChange(value) {
    data.sliderValue = value
    const newValue = props.min + Math.round((props.max - props.min) * value / props.step) * props.step
    if (newValue == props.value) {
        return
    }
    emit('change', newValue)
}

onMounted(() => {
    data.sliderValue = Math.min(1.0, Math.max(0.0, (props.value - props.min) / (props.max - props.min)))
})
</script>

<template>
    <circle-slider :value="data.sliderValue" :step="sensitivity" @change="onChange($event)">
        <div class="column column--center">
            <div>{{ value }}{{ sufix }}</div>
            <div v-if="label" class="label">{{ label }}</div>
        </div>
    </circle-slider>
</template>

<style scoped>
.label {
    font-size: 12px;
    color: var(--color-fg-secondary);
}
</style>
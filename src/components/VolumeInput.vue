<script setup>
import { reactive } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { computed } from '@vue/runtime-core'
import CircleSlider from './CircleSlider.vue'
import { useScale } from '../services/scale'

const scale = useScale([0.0, 0.25, 0.5, 0.75, 1.0], [0, 100, 1000, 3000, 10000])

const data = reactive({
    sliderValue: 0.5
})

const props = defineProps({
    value: { type: Number }
})

const unit = computed(() => {
    return props.value >= 1000 ? 'l' : 'ml'
})
const readUnit = computed(() => {
    return props.value >= 1000 ? (Math.round(props.value / 10) / 100).toFixed(2) : props.value
})

const emit = defineEmits(['change'])

function onChange(value) {
    data.sliderValue = value
    const newValue = scale.mapRound(value, [5, 50, 100, 250])
    if (newValue == props.value) {
        return
    }
    emit('change', newValue)
}

onMounted(() => {
    data.sliderValue = scale.norm(props.value)
})
</script>

<template>
<div class="pos-r row row--middle">
    <circle-slider :value="data.sliderValue" @change="onChange($event)" :step="1">
        <div class="column column--center">
            <div>{{ readUnit }}</div>
            <div class="unit">{{ unit }}</div>
        </div>
    </circle-slider> 
</div>
</template>

<style scoped>
.unit {
    font-size: 12px;
    color: var(--color-fg-secondary);
}
</style>
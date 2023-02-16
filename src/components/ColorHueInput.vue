<script setup>
import { reactive } from '@vue/reactivity'
import { computed, onMounted, watch } from '@vue/runtime-core'
import CircleSlider from './CircleSlider.vue'

const data = reactive({
    sliderValue: 0.0
})

const props = defineProps({
    value: { type: Number },
    saturation: { type: Number, default: 50 },
    lightness: { type: Number, default: 50 }
})

const emit = defineEmits(['change'])

const hslCss = computed(() => {
    return `hsl(${props.value}deg, ${props.saturation}%, ${props.lightness}%)`
})

function onChange(value) {
    data.sliderValue = value
    const newValue = Math.round(value * 359)
    if (newValue == props.value) {
        return
    }
    emit('change', newValue)
}

watch(() => props.value, (newValue) => {
    if (Math.round(data.sliderValue * 359) == newValue) {
        return
    }
    data.sliderValue = Math.min(1.0, Math.max(0.0, newValue / 359))
})

onMounted(() => {
    data.sliderValue = Math.min(1.0, Math.max(0.0, props.value / 359))
})
</script>

<template>
    <circle-slider :value="data.sliderValue" :step="1" @change="onChange($event)">
        <div class="column column--center">
            <div class="color-preview" :style="{'background-color': hslCss}"></div>
        </div>
    </circle-slider>
</template>

<style scoped>
.color-preview {
    width: 22px;
    height: 6px;
    border-radius: 4px;
}
</style>
<script setup>
import { reactive } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import CircleSlider from './CircleSlider.vue'

const data = reactive({
    sliderValue: 0.0
})

const props = defineProps({
    value: { type: String }
})

const emit = defineEmits(['change'])

function onChange(value) {
    data.sliderValue = value
    const newValue = String.fromCharCode("A".charCodeAt(0) + Math.round(value * 25))
    if (newValue == props.value) {
        return
    }
    emit('change', newValue)
}

onMounted(() => {
    data.sliderValue = (props.value.charCodeAt(0) - 'A'.charCodeAt(0)) / 25
})
</script>

<template>
<circle-slider :value="data.sliderValue" :step="1.5" @change="onChange($event)">{{ value }}</circle-slider>
</template>

<style scoped>

</style>
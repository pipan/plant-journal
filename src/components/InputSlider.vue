<script setup>
import { ref } from 'vue'
import { reactive } from '@vue/reactivity'

const props = defineProps({
    value: Number
})
const data = reactive({
    isFocused: false
})
const emit = defineEmits(['change'])
const inputSlider = ref(null)

function setValue(value) {
    if (value == props.value) {
        return
    }
    emit('change', value)
}

function onDrag(event) {
    const newValue = (event.detail.x - inputSlider.value.offsetLeft) / inputSlider.value.offsetWidth
    setValue(Math.min(Math.max(newValue, 0), 1))
}
</script>

<template>
    <div class="input-slider" tabindex="0"
        :class="{ 'input-field--focus': data.isFocused }"
        v-drag ref="inputSlider"
        @appDrag="onDrag($event)">
        <div class="input-slider__pin" :style="{ left: (value * 100) + '%' }"></div>
    </div>
</template>

<style scoped>
.input-slider {
    position: relative;
    width: 100%;
    cursor: move;
}

.input-slider::before {
    content: '';
    position: absolute;
    top: 50%;
    width: 100%;
    height: 1px;
    background-color: var(--color-border);
}

.input-slider__pin {
    position: relative;
    z-index: 1;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background-color: var(--color-fg-secondary);
    transform: translateX(-50%);
    transition: background-color 120ms ease, transform 120ms ease;
}

.input-slider:focus {
    outline: none;
}

.input-slider:focus .input-slider__pin, .input-slider.drag--active .input-slider__pin {
    transform: translateX(-50%) scale(120%);
    background-color: var(--color-highlight-primary);
}

.input-slider:hover .input-slider__pin {
    background-color: var(--color-highlight-primary);
}

</style>
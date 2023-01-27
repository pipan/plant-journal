<script setup>
import { ref } from 'vue'
import { reactive } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core'

let isDraging = false

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

function mouseMove(event) {
    if (!isDraging) {
        return
    }

    const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX
    const newValue = (x - inputSlider.value.offsetLeft) / inputSlider.value.offsetWidth
    setValue(Math.min(Math.max(newValue, 0), 1))
}

function startDrag() {
    isDraging = true
}

function stopDrag() {
    isDraging = false
}

onUnmounted(() => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touhmove', mouseMove)
    document.removeEventListener('touchend', stopDrag)
})

onMounted(() => {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchmove', mouseMove)
    document.addEventListener('touchend', stopDrag)
})
</script>

<template>
    <div class="input-slider" :class="{ 'input-field--focus': data.isFocused }" tabindex="0" ref="inputSlider" @mousedown.stop="startDrag" @touchstart.stop="startDrag">
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

.input-slider:focus .input-slider__pin {
    transform: translateX(-50%) scale(120%);
    background-color: var(--color-highlight-primary);
}

.input-slider:hover .input-slider__pin {
    background-color: var(--color-highlight-primary);
}

</style>
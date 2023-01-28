<script setup>
import { reactive } from '@vue/reactivity'

let previousTouchEvent = null

const props = defineProps({
    value: { type: Number },
    step: { type: Number, default: 3 }
})
const data = reactive({
    isFocused: false
})
const emit = defineEmits(['change'])

function setValue(value) {
    if (value == props.value) {
        return
    }
    emit('change', value)
}

function onDrag(event) {
    let movementX = event.deltaX
    if (movementX === undefined) {
        if (previousTouchEvent) {
            movementX = event.touches[0].clientX - previousTouchEvent.touches[0].clientX
        } else {
            movementX = 0
        }
        previousTouchEvent = event
    }
    const newValue = props.value + props.step * movementX / document.body.offsetWidth
    setValue(Math.min(Math.max(newValue, 0), 1))
}

function onScroll(event) {
    if (event.wheelDelta > 0) {
        setValue(Math.min(props.value + 0.01 * props.step, 1.0))
    } else {
        setValue(Math.max(props.value - 0.01 * props.step, 0.0))
    }
}
</script>

<template>
    <div class="circle-slider" :class="{ 'circle-field--focus': data.isFocused }" :style="{'--angel-value': (10 + (value * 340)) + 'deg'}"
        tabindex="0"
        @wheel="onScroll($event)"
        v-drag="onDrag">
        <div class="circle-slider-content">
            <slot></slot>
        </div>
        <div class="circle-slider__pin"></div>
    </div>
</template>

<style scoped>
.circle-slider {
    --angel-value: 10deg;
    --border-width: 2px;
    position: relative;
    width: 56px;
    height: 56px;
    background: conic-gradient(var(--color-bg) 0deg 10deg, var(--color-highlight-primary) 10deg var(--angel-value), var(--color-border) var(--angel-value) 350deg, var(--color-bg) 350deg 360deg);
    border-radius: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: move;
    flex-shrink: 0;
}

.circle-slider-content {
    position: relative;
    z-index: 1;
}

.circle-slider::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: var(--border-width);
    left: var(--border-width);
    width: calc(100% - 2 * var(--border-width));
    height: calc(100% - 2 * var(--border-width));
    background-color: var(--color-bg);
    border-radius: 100%;
}

.circle-slider__pin {
    position: absolute;
    top: -5px;
    left: calc(50% - 6px);
    z-index: 1;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background-color: var(--color-highlight-primary);
    transform: rotate(var(--angel-value));
    transition: background-color 120ms ease;
    transform-origin: 6px 33px;
}

</style>
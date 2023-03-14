<script setup>
import { reactive, ref } from '@vue/reactivity'

const circleDiv = ref(null)

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
    const circleDivBounds = circleDiv.value.getBoundingClientRect()
    const center = {
        x: circleDivBounds.left + circleDivBounds.width / 2,
        y: circleDivBounds.top + circleDivBounds.height / 2
    }
    const radCircle = 2 * Math.PI
    const radCircleGap = radCircle / 30
    const xLength = event.detail.x - center.x
    const yLength = center.y - event.detail.y
    const centerLength = Math.sqrt(Math.pow(center.x - event.detail.x, 2) + Math.pow(center.y - event.detail.y, 2))
    let angleRad = Math.acos(yLength / centerLength)
    if (xLength < 0) {
        angleRad = radCircle - angleRad
    }
    const newValue = (angleRad - radCircleGap) / (radCircle - 2 * radCircleGap)
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
    <div class="circle-slider" :class="{ 'circle-field--focus': data.isFocused }" :style="{'--angel-value': (12 + (value * 336)) + 'deg'}"
        tabindex="0" v-drag ref="circleDiv"
        @wheel="onScroll($event)"
        @appDrag="onDrag($event)">
        <div class="circle-slider-content">
            <slot></slot>
        </div>
        <div class="circle-slider__pin"></div>
    </div>
</template>

<style scoped>
.circle-slider {
    --angel-value: 12deg;
    --border-width: 2px;
    position: relative;
    width: 56px;
    height: 56px;
    background: conic-gradient(var(--color-bg) 0deg 12deg, var(--color-highlight-primary) 12deg var(--angel-value), var(--color-border) var(--angel-value) 348deg, var(--color-bg) 348deg 360deg);
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
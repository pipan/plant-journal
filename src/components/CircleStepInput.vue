<script setup>
import { reactive } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core'

let isDraging = false

const data = reactive({
    isFocused: false,
    angle: 0,
    angleChange: 0
})
const emit = defineEmits(['change'])

function moveAngle(value) {
    data.angle += value
    data.angleChange += value
    if (Math.abs(data.angleChange) >= 10) {
        emit('change', data.angleChange / Math.abs(data.angleChange))
        data.angleChange = 0
    }
}

function mouseMove(event) {
    if (!isDraging) {
        return
    }

    const angle = 720 * event.movementX / document.body.offsetWidth
    moveAngle(angle)
}

function startDrag() {
    isDraging = true
}

function stopDrag(event) {
    event.preventDefault()
    isDraging = false
}

function onScroll(event) {
    if (event.wheelDelta > 0) {
        moveAngle(10)
    } else {
        moveAngle(-10)
    }
}

onUnmounted(() => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', stopDrag)
})

onMounted(() => {
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', stopDrag)
})
</script>

<template>
    <div class="circle-slider" :class="{ 'circle-field--focus': data.isFocused }" :style="{'--rotate-angle': data.angle + 'deg'}"
        tabindex="0"
        @wheel="onScroll($event)"
        @mousedown="startDrag()">
        <div class="circle-slider-content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.circle-slider {
    --border-width: 2px;
    position: relative;
    user-select: none;
    cursor: move;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.circle-slider::before {
    content: '';
    width: 56px;
    height: 56px;
    background: conic-gradient(
        var(--color-bg) 0deg 10deg,
        var(--color-highlight-primary) 10deg 40deg,
        var(--color-bg) 40deg 50deg,
        var(--color-border) 50deg 360deg);
    border-radius: 100%;
    transform: rotate(var(--rotate-angle));
}

.circle-slider-content {
    box-sizing: border-box;
    position: absolute;
    top: var(--border-width);
    left: var(--border-width);
    width: calc(100% - 2 * var(--border-width));
    height: calc(100% - 2 * var(--border-width));
    background-color: var(--color-bg);
    border-radius: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

</style>
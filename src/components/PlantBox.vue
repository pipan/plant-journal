<script setup>
import { reactive } from "@vue/reactivity"

let drag = {
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    interval: null,
}

const data = reactive({
    dragStatus: ''
})

const props = defineProps({
    plant: Object
})

const emit = defineEmits(['move', 'select'])

function select() {
    if (data.dragStatus === 'move') {
        return;
    }
    emit('select')
}

function checkMove() {
    if (data.dragStatus !== 'move') {
        return;
    }
    const diff = { x: drag.current.x - drag.start.x, y: drag.current.y - drag.start.y }
    if (diff.x !== 0 || diff.y !== 0) {
        drag.start = drag.current
        move(diff.x, diff.y)    
    }
}

function move(x, y) {
    emit('move', { deltaX: x, deltaY: y })
}

function dragStart(event) {
    const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX
    const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY
    data.dragStatus = 'start'
    drag.start = { x: x, y: y }
    drag.current = drag.start
    document.addEventListener('mousemove', dragMove)
    document.addEventListener('touchmove', dragMove)
    document.addEventListener('mouseup', dragStop)
    document.addEventListener('touchend', dragStop)
    if (drag.interval) {
        clearInterval(drag.interval)
    }
    drag.interval = setInterval(checkMove, 10)
}

function dragStop() {
    if (drag.interval) {
        clearInterval(drag.interval)
        drag.interval = null
        checkMove()
    }
    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('touchmove', dragMove)
    document.removeEventListener('mouseup', dragStop)
    document.removeEventListener('touchend', dragStop)
    data.dragStatus = ''
}

function dragMove(event) {
    if (['start', 'move'].indexOf(data.dragStatus) === -1) {
        return;
    }
    data.dragStatus = 'move'
    
    const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX
    const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY
    drag.current = { x: x, y: y }
}

</script>

<template>
<div class="plant-box column gap-s column--center"
    :class="['color--' + plant.color, data.dragStatus === 'move' ? 'dragging' : '']"
    :style="{ 'left': plant.x * 100 + '%', 'top': plant.y * 100 + '%' }"
    @mousedown.left="dragStart($event)"
    @touchstart="dragStart($event)"
    @touchend="select()"
    @mouseup="select()"
    @click.stop>
    <div class="plant" :class="'shape--' + plant.shape"></div>
    <div class="plant-label">{{ plant.name }}</div>
</div>
</template>

<style scoped>
.plant-box {
    transform: translateX(-50%) translateY(-50%);
    --shape-size: 64px;
    cursor: move;
}

.plant-box.dragging {
    transform: translateX(-50%) translateY(-50%) scale(1.1);
    z-index: 5;
}

.plant-label {
    border: solid 1px var(--color-value);
    border-radius: 8px;
    text-align: center;
    padding: 4px var(--unit-m);
    font-size: 12px;
    background-color: var(--color-bg);
}

.plant {
    border: 3px solid var(--color-value);
    box-sizing: border-box;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: var(--color-bg);
    transition: border-radius 120ms ease, height 120ms ease, margin 120ms ease, border-color 120ms ease;
}

.plant-box.dragging .plant {
    box-shadow: 0px 0px 10px var(--color-value);
}

.plant-box.dragging .plant-label {
    box-shadow: 0px 0px 6px var(--color-value);
}
</style>
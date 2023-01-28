<script setup>
import { computed, onMounted, reactive } from '@vue/runtime-core'
import { useCanvasRepository } from '../repository/canvas.repository'

const canvasRepository = useCanvasRepository()
const emit = defineEmits(['change'])

const data = reactive({
    items: []
})

const props = defineProps({
    value: { type: Number }
})

function onChange(value) {
    if (value == props.value) {
        return
    }
    emit('change', value)
}

onMounted(() => {
    canvasRepository.selectAll().then((canvas) => {
        data.items = canvas
    })
})
</script>

<template>
    <div>
        <div class="column gap">
            <div class="row gap" v-for="i of [0, 1, 2]" :key="i">
                <div class="canvas-dot" :class="{'active': value == i * 3 + j}" v-for="j of [0, 1, 2]" :key="j"></div>
            </div>
        </div>
        <select :value="value" @change="setValue($event)">
            <option v-for="item of data.items" :key="item.id">{{ item.name }}</option>
        </select>
    </div>
</template>

<style scoped>
.canvas-dot {
    width: 6px;
    height: 6px;
    background-color: var(--color-border);
    border-radius: 100%;
    transition: backgroundColor 160ms ease;
}

.canvas-dot.active {
    background-color: var(--color-primary);
}

.gap {
    gap: 4px
}
</style>
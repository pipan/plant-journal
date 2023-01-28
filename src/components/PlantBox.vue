<script setup>
import { reactive } from "@vue/reactivity"
import { computed } from "@vue/runtime-core"

const props = defineProps({
    plant: Object
})

const data = reactive({
    mouse: ''
})

const emit = defineEmits(['move', 'select', 'selectHold'])

const volumeClass = computed(() => {
    if (props.plant.volume < 1000) {
        return 'volume--s'
    } else if (props.plant.volume < 3000) {
        return 'volume--m'
    } else {
        return 'volume--l'
    }
})

function select() {
    if (data.mouse != 'down') {
        return
    }
    data.mouse = 'up'
    emit('select')
}

function move(event) {
    data.mouse = 'move'
    emit('move', event)
}

function selectHold() {
    data.mouse = 'context'
    emit('selectHold')
}

</script>

<template>
<div class="plant-box"
    :class="['color--' + plant.color, volumeClass]"
    :style="{ 'left': plant.x * 100 + '%', 'top': plant.y * 100 + '%' }"
    @mousedown="data.mouse = 'down'"
    @mouseup="select()"
    @click.stop
    v-drag="move">
    <div class="column gap-s column--center" v-hold @contextmenu.prevent.stop="selectHold()">
        <div class="plant" :class="'shape--' + plant.shape"></div>
        <div class="plant-label">{{ plant.name }}</div>
    </div>
</div>
</template>

<style scoped>
.plant-box {
    transform: translateX(-50%) translateY(-33%);
    cursor: move;
}

.plant-box.drag--active:active {
    transform: translateX(-50%) translateY(-33%) scale(1.15);
    z-index: 5;
}

.plant-box:active {
    transition-duration: 0ms;
    transform: translateX(-50%) translateY(-33%) scale(0.9);
}

.plant-label {
    border: solid 1px var(--color-value);
    border-radius: 8px;
    text-align: center;
    padding: 4px var(--unit-m);
    font-size: 12px;
    background-color: var(--color-bg);
    white-space: nowrap;
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

.plant-box.drag--active .plant {
    box-shadow: 0px 0px 10px var(--color-value);
}

.plant-box.drag--active .plant-label {
    box-shadow: 0px 0px 6px var(--color-value);
}

.holdable::before {
    top: -6px;
}
</style>
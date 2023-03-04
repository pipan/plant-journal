<script setup>
import { reactive } from "@vue/reactivity"
import { computed, onMounted, watch } from "@vue/runtime-core"
import { useEventRepository } from "../repository/eventRepository"
import { hslCss } from '../services/color'

const eventRepository = useEventRepository()

const props = defineProps({
    plant: Object
})

const data = reactive({
    mouse: '',
    eventTypes: ['', '', '', '', '', '', '']
})

const emit = defineEmits(['move', 'select', 'selectHold'])

const hslColor = computed(() => {
    return hslCss(props.plant.hue !== undefined ? props.plant.hue : 30)
})

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

function loadEventTypes() {
    eventRepository.selectByPot(props.plant.id).then((events) => {
        const dayMs = 24 * 60 * 60 * 1000
        let dateLimit = new Date()
        dateLimit.setTime(dateLimit.getTime() - 6 * dayMs)
        dateLimit.setHours(0, 0, 0, 0)
        events = events.filter((e) => {
            return e.createdAt >= dateLimit
        })
        events.sort((a, b) => {
            if (a.createdAt.getTime() < b.createdAt.getTime()) return 1
            else if (a.createdAt.getTime() > b.createdAt.getTime()) return -1
            else return 0
        })
        for (let event of events) {
            let index = 6 - Math.floor((event.createdAt.getTime() - dateLimit.getTime()) / dayMs)
            if (data.eventTypes[index]) {
                continue
            }
            data.eventTypes[index] = event.type
        }
    })
}

watch(() => props.plant, () => {
    loadEventTypes()
})

onMounted(() => {
    loadEventTypes()
})

</script>

<template>
<div class="plant-box"
    :class="[volumeClass, plant.name ? '' : 'plant-box--no-name']"
    :style="{ '--left': plant.x * 100 + '%', '--top': plant.y * 100 + '%', '--color-value': hslColor }"
    @mousedown="data.mouse = 'down'"
    @mouseup="select()"
    @click.stop
    v-drag="move">
    <div class="column gap-s column--center" v-hold @contextmenu.prevent.stop="selectHold()">
        <div class="plant" :class="'shape--' + plant.shape">
            <div class="event" :class="eventType ? 'color-' + eventType : 'color--border'" v-for="(eventType, index) of data.eventTypes" :key="index"></div>
        </div>
        <div class="plant-label">
            <div v-if="plant.name">{{ plant.name }}</div>
            <div class="plant-label__id">{{ plant.id }}</div>
        </div>
    </div>
</div>
</template>

<style scoped>
.plant-box.plant-box--no-name { --transform-y: -50%; }
.plant-box {
    --transform-y: -33%;
    transform: translateX(-50%) translateY(var(--transform-y));
    left: var(--left);
    top: var(--top);
    cursor: move;
    user-select: none;
}

.orientation-90 .plant-box {
    left: var(--top);
    top: calc(100% - var(--left));
}
.orientation-180 .plant-box {
    left: calc(100% - var(--left));
    top: calc(100% - var(--top));
}
.orientation-270 .plant-box {
    left: calc(100% - var(--top));
    top: var(--left);
}

.plant-box.drag--active:active {
    transform: translateX(-50%) translateY(var(--transform-y)) scale(1.15);
    z-index: 5;
}

.plant-box:active {
    transition-duration: 0ms;
    transform: translateX(-50%) translateY(var(--transform-y)) scale(0.9);
}

.plant-label {
    border: solid 1px var(--color-value);
    border-radius: 8px;
    text-align: center;
    padding: 4px var(--unit-s);
    font-size: 12px;
    background-color: var(--color-bg);
    white-space: nowrap;
    user-select: none;
    display: flex;
    flex-direction: row;
    gap: var(--unit-s);
    align-items: center;
}

.plant-label__id {
    border-radius: 4px;
    color: var(--color-value);
}

.plant {
    position: relative;
    border: 3px solid var(--color-value);
    box-sizing: border-box;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: var(--color-bg);
    transition: border-radius 120ms ease, height 120ms ease, width 120ms ease, margin 120ms ease, border-color 120ms ease;
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

.volume--s .event { --event-size: 4px; }
.volume--m .event { --event-size: 6px; }
.volume--l .event { --event-size: 8px; }
.event {
    position: absolute;
    width: var(--event-size);
    height: var(--event-size);
    left: 50%;
    top: 50%;
    background-color: var(--color-value);
    border-radius: 100%;
}

.event:nth-child(7n+1) { transform: translateX(85%) translateY(-185%); }
.event:nth-child(7n+2) { transform: translateX(150%) translateY(-50%); opacity: 0.92; }
.event:nth-child(7n+3) { transform: translateX(85%) translateY(85%); opacity: 0.84; }
.event:nth-child(7n+4) { transform: translateX(-50%) translateY(150%); opacity: 0.76; }
.event:nth-child(7n+5) { transform: translateX(-185%) translateY(85%); opacity: 0.68; }
.event:nth-child(7n+6) { transform: translateX(-250%) translateY(-50%); opacity: 0.6; }
.event:nth-child(7n+7) { transform: translateX(-185%) translateY(-185%); opacity: 0.52; }

.shape--rectangle .event:nth-child(7n+1) { transform: translateX(85%) translateY(-135%); }
.shape--rectangle .event:nth-child(7n+2) { transform: translateX(200%) translateY(-50%); }
.shape--rectangle .event:nth-child(7n+3) { transform: translateX(85%) translateY(35%); }
.shape--rectangle .event:nth-child(7n+4) { transform: translateX(-50%) translateY(35%); }
.shape--rectangle .event:nth-child(7n+5) { transform: translateX(-185%) translateY(35%); }
.shape--rectangle .event:nth-child(7n+6) { transform: translateX(-300%) translateY(-50%); }
.shape--rectangle .event:nth-child(7n+7) { transform: translateX(-185%) translateY(-135%); }

.shape--rectangle90 .event:nth-child(7n+1) { transform: translateX(55%) translateY(-185%); }
.shape--rectangle90 .event:nth-child(7n+2) { transform: translateX(55%) translateY(-50%); }
.shape--rectangle90 .event:nth-child(7n+3) { transform: translateX(55%) translateY(85%); }
.shape--rectangle90 .event:nth-child(7n+4) { transform: translateX(-50%) translateY(200%); }
.shape--rectangle90 .event:nth-child(7n+5) { transform: translateX(-155%) translateY(85%); }
.shape--rectangle90 .event:nth-child(7n+6) { transform: translateX(-155%) translateY(-50%); }
.shape--rectangle90 .event:nth-child(7n+7) { transform: translateX(-155%) translateY(-185%); }
</style>
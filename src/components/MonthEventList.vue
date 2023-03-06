<script setup>
import { computed } from "@vue/runtime-core"
import PlantInlineList from './PlantInlineList.vue'

const config = {
    water: (event) => {
        return {
            icon: ['icon-water-drop', 'color-water'],
            firstLine: 'Water',
            secondLine: event.volume + " ml"
        }
    },
    fertilize: (event) => {
        return {
            icon: ['icon-fertilizer', 'color-fertilize'],
            firstLine: 'Fertilize',
            secondLine: event.volume + " g\t" + [event.n, event.p, event.k].join("-")
        }
    },
    plantOut: (event) => {
        let list = [event.plantId]
        for (let item of event.similarList) {
            list.push(item.plantId)
        }
        return {
            icon: ['icon-trowel', 'color-trowel'],
            firstLine: 'Plant Out',
            secondLine: '',
            plantList: list
        }
    },
    plantIn: (event) => {
        let list = [event.plantId]
        for (let item of event.similarList) {
            list.push(item.plantId)
        }
        return {
            icon: ['icon-trowel', 'color-trowel'],
            firstLine: 'Plant in',
            secondLine: '',
            plantList: list
        }
    },
    cut: (event) => {
        let list = [event.plantId]
        for (let item of event.similarList) {
            list.push(item.plantId)
        }
        return {
            icon: ['icon-shears', 'color-shears'],
            firstLine: 'Cut',
            secondLine: '',
            plantList: list
        }
    },
    death: (event) => {
        let list = [event.plantId]
        for (let item of event.similarList) {
            list.push(item.plantId)
        }
        return {
            icon: ['icon-skull', 'color-skull'],
            firstLine: 'Death',
            secondLine: '',
            plantList: list
        }
    },
    note: (event) => {
        return {
            icon: ['icon-note', 'color-note'],
            firstLine: 'Note',
            secondLine: event.note
        }
    }
}

const emit = defineEmits(['select'])

const props = defineProps({
    month: { type: Number },
    year: { type: Number },
    events: { type: Array, default: () => [] },
    plantsMap: { type: Object, default: () => { return {} }}
})

const monthLabel = computed(() => {
    const monthDate = new Date(props.year, props.month - 1, 1, 0, 0, 0, 0)
    return monthDate.toLocaleDateString(navigator.language, { year: 'numeric', month: 'short' })
})

const renderEvents = computed(() => {
    let result = []
    for (let event of props.events) {
        result.push(Object.assign({
            native: event,
            key: event.type + '-' + event.createdAt.getTime(),
            date: event.createdAt.getDate(),
            time: event.createdAt.toLocaleTimeString(navigator.language, { timeStyle: "short", hours: '2-digit', hour12: false }) 
        }, config[event.type](event)))
    }
    return result
})

function select(event) {
    let list = [event.native.id]
    for (let item of event.native.similarList) {
        list.push(item.id)
    }
    emit('select', list)
}

</script>

<template>
    <div class="column">
        <div class="devider">{{ monthLabel }}</div>
        <transition-group name="animation-row" duration="300" appear>
            <div class="row row--middle gap-m p-m" v-for="event of renderEvents" :key="event.key"
                v-hold
                @contextmenu.prevent="select(event)">
                <div class="event-icon">
                    <i class="icon icon--l" :class="event.icon"></i>
                </div>
                <div class="column gap-s flex ellipsis">
                    <div>{{ event.firstLine }}</div>
                    <div class="text-secondary text-s text-pre" v-if="event.secondLine">{{ event.secondLine }}</div>
                    <plant-inline-list class="text-secondary text-s text-pre" :ids="event.plantList" v-if="event.plantList"></plant-inline-list>
                </div>
                <div class="column column--center text-idle">
                    <div>{{ event.date }}</div>
                    <div class="text-s">{{ event.time }}</div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<style scoped>
.event-icon {
    --color-value: var(--color-fg-secondary)
    border-radius: 100%;
    padding: 8px;
    flex-shrink: 0;
}

.event-icon .icon {
    color: var(--color-value);
    opacity: 0.65;
}

.devider {
    position: relative;
    padding: var(--unit-m);
    text-align: right;
    color: var(--color-border);
}
</style>

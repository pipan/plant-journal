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
            date: event.createdAt.getDate(),
            time: event.createdAt.toLocaleTimeString(navigator.language, { timeStyle: "short", hours: '2-digit', hour12: false }) 
        }, config[event.type](event)))
    }
    return result
})

</script>

<template>
    <div class="column">
        <div class="devider">{{ monthLabel }}</div>
        <div class="row row--middle gap-m p-m" v-for="event of renderEvents" :key="event.native.id">
            <div class="event-icon">
                <i class="icon icon--l" :class="event.icon"></i>
            </div>
            <div class="column gap-s flex">
                <div>{{ event.firstLine }}</div>
                <div class="text-secondary text-s text-pre" v-if="event.secondLine">{{ event.secondLine }}</div>
                <plant-inline-list class="text-secondary text-s text-pre" :ids="event.plantList" v-if="event.plantList"></plant-inline-list>
            </div>
            <div class="column column--center text-idle">
                <div>{{ event.date }}</div>
                <div class="text-s">{{ event.time }}</div>
            </div>
        </div>
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

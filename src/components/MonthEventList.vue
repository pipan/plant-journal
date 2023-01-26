<script setup>
import { computed } from "@vue/runtime-core"

const config = {
    water: (event) => {
        return {
            icon: 'icon-water-drop',
            firstLine: 'Water',
            secondLine: event.volume + " ml"
        }
    }
}

const props = defineProps({
    month: { type: Number },
    year: { type: Number },
    events: { type: Array, default: () => [] }
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
                <i class="icon" :class="event.icon"></i>
            </div>
            <div class="column gap-s flex">
                <div>{{ event.firstLine }}</div>
                <div class="text-secondary text-s">{{ event.secondLine }}</div>
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
    border: 1px solid var(--color-border);
    border-radius: 100%;
    padding: 4px;
    flex-shrink: 0;
}

.devider {
    position: relative;
    padding: var(--unit-m);
    text-align: right;
    color: var(--color-border);
}
</style>

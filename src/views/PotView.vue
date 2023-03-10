<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from '@vue/runtime-core'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import BottomDrawer from '../components/BottomDrawer.vue'
import MonthEventList from '../components/MonthEventList.vue'
import PlantSelect from '../components/PlantSelect.vue'
import { useEventRepository } from '../repository/eventRepository'
import { usePlantRepository } from '../repository/plant.repository'
import { usePotRepository } from '../repository/pot.repository'

const potRepository = usePotRepository()
const plantRepository = usePlantRepository()
const eventRepository = useEventRepository()
const router = useRouter()
const route = useRoute()

const data = reactive({
    pot: null,
    plants: [],
    events: [],
    selectedPlants: [],
    isCheckMode: false,
    loading: true
})

const view = ref(null)

const eventBlocks = computed(() => {
    let result = []
    for (let event of data.events) {
        const blockId = event.createdAt.getFullYear() + "-" + (event.createdAt.getMonth() + 1)
        if (result.length === 0 || result[result.length - 1].id !== blockId) {
            result.push({ id: blockId, date: event.createdAt, events: [] })
        }
        result[result.length - 1].events.push(event)
    }
    for (let item of result) {
        let uniqueEvents = []
        for (let event of item.events) {
            const lastEvent = uniqueEvents[uniqueEvents.length - 1]
            if (uniqueEvents.length > 0 && lastEvent.type === event.type && lastEvent.createdAt.getTime() === event.createdAt.getTime()) {
                lastEvent.similarList.push(event)
                continue
            }
            event.similarList = []
            uniqueEvents.push(event)
        }
        item.events = uniqueEvents
    }
    return result
})

const plantsMap = computed(() => {
    let map = {}
    for (let plant of data.plants) {
        map[plant.id] = plant
    }
    return map
})

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'home' })
    }
    router.go(-1)
}

function loadPlants() {
    const id = parseInt(route.params.id)
    return plantRepository.selectAllByPot(id)
}

function load(plantIds) {
    data.loading = true
    const id = parseInt(route.params.id)
    potRepository.select(id).then((pot) => {
        data.pot = pot
    })
    return loadPlants().then((plants) => {
        data.plants = plants
        return eventRepository.selectByPlantsForPot(plantIds, id)
    }).then((events) => {
        data.events = events
        data.events.sort((a, b) => {
            if (a.createdAt.getTime() < b.createdAt.getTime()) return 1
            else if (a.createdAt.getTime() > b.createdAt.getTime()) return -1
            else return 0
        })
        data.loading = false
        return data.events
    })
}

function openEvent(ids) {
    router.push({ name: 'event.edit', query: { ids: ids } })
}

function openPlantEdit(id) {
    router.push({ name: 'plant.edit', params: { plantId: id } })
}

function setSelectedPlants(value) {
    data.selectedPlants = value
    load(data.selectedPlants)
}

onBeforeRouteUpdate((to, from) => {
    if (to.name !== 'pot') {
        return
    }
    load(data.selectedPlants)
})

onMounted(() => {
    loadPlants().then((plants) => {
        data.plants = plants
        let selected = []
        for (let plant of data.plants) {
            selected.push(plant.id)
        }
        data.selectedPlants = selected
        return load(data.selectedPlants)
    })
})

onBeforeUnmount(() => {
    const scrollTop = document.scrollingElement.scrollTop
    view.value.style.top = (scrollTop * -1) + "px"
    view.value.style.setProperty('--origin-y', scrollTop + "px") 
})
</script>

<template>
<div>
    <div class="view column" id="pot-view" ref="view">
        <h1 v-if="data.pot?.name">{{ data.pot?.name || '' }}</h1>
        <div class="column flex gap-s py-m">
            <plant-select align="inline" mode="short"
                :value="data.selectedPlants"
                :options="data.plants"
                :holdable="true"
                @change="setSelectedPlants($event)"
                @select="openPlantEdit($event.id)"></plant-select>
            <div class="column" v-if="eventBlocks.length > 0">
                <month-event-list v-for="block of eventBlocks" :key="block.id"
                    :plantsMap="plantsMap.value"
                    :month="block.date.getMonth() + 1"
                    :year="block.date.getFullYear()"
                    :events="block.events"
                    @select="openEvent($event)"></month-event-list>
            </div>
            <div class="column flex column--middle column--center" v-if="eventBlocks.length === 0 && !data.loading">
                <div class="p-l text-secondary">
                    No events to display
                </div>
            </div>
        </div>
    </div>
    <bottom-drawer>
        <div class="row text-center gap-s p-s">
            <button type="button" class="bottom-drawer-button clickable" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
        </div>
    </bottom-drawer>
    <router-view v-slot="{ Component }">
        <transition name="animation-modal" duration="300">
            <component :is="Component"></component>
        </transition>
    </router-view>
</div>
</template>

<style scoped>
h1 {
    position: sticky;
    top: 0px;
    z-index: 2;
    font-size: 1.5rem;
    text-align: center;
    padding: var(--unit-m);
    margin: 0px;
    font-weight: 100;
    background-color: var(--color-overlay);
}

h1::before {
    content: '';
    position: absolute;
    width: 80%;
    height: 1px;
    left: 10%;
    bottom: 0px;
    background-color: var(--color-border);
}

.bottom-drawer-button {
    border-radius: 4px;
    padding: var(--unit-s);
    flex: 1;
}
</style>

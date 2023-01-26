<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from '@vue/runtime-core'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import BottomDrawer from '../components/BottomDrawer.vue'
import MonthEventList from '../components/MonthEventList.vue'
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
    events: []
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
                continue
            }
            uniqueEvents.push(event)
        }
        item.events = uniqueEvents
    }
    return result
})

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'home' })
    }
    router.go(-1)
}

function load () {
    const id = parseInt(route.params.id)
    potRepository.select(id).then((pot) => {
        data.pot = pot
    })
    plantRepository.selectByPot(id)
        .then((plants) => {
            data.plants = plants
            let plantIds = []
            for (let plant of plants) {
                plantIds.push(plant.id)
            }
            return eventRepository.selectByPlants(plantIds)    
        }).then((events) => {
            data.events = events
            data.events.sort((a, b) => {
                if (a.createdAt < b.createdAt) return -1
                else if (a.createdAt > b.createdAt) return 1
                else return 0
            })
            return data.events
        })
}

function openPlantEdit(id) {
    router.push({ name: 'plant.edit', params: { plantId: id } })
}

onBeforeRouteUpdate((to, from) => {
    if (to.name !== 'pot') {
        return
    }
    load()
})

onMounted(() => {
    load()
})

onBeforeUnmount(() => {
    const scrollTop = document.scrollingElement.scrollTop
    view.value.style.top = (scrollTop * -1) + "px"
    view.value.style.setProperty('--origin-y', scrollTop + "px") 
})
</script>

<template>
<div>
    <div class="view" id="pot-view" ref="view">
        <h1>{{ data.pot?.name || '' }}</h1>
        <div class="column gap-m py-m">
            <div class="row gap-m py-s px-m scroll-x scroll--hidden">
                <div class="plant" v-for="plant of data.plants" :key="plant.id" @contextmenu.prevent="openPlantEdit(plant.id)">
                    <div class="plant__tag" v-if="plant.tag">{{ plant.tag }}</div>
                    <div class="plant__variety">{{ plant.variety }}</div>
                </div>
            </div>
            <div class="column">
                <month-event-list v-for="block of eventBlocks" :key="block.id"
                    :month="block.date.getMonth() + 1"
                    :year="block.date.getFullYear()"
                    :events="block.events"></month-event-list>
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
        <transition name="animation-modal" duration="220">
            <component :is="Component"></component>
        </transition>
    </router-view>
</div>
</template>

<style scoped>
.view  {
    min-height: 100vh;
    width: 100vw;
    background-color: var(--color-bg);
    padding-bottom: 58px;
    box-sizing: border-box;
}
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

.plant {
    --plant-color-border: var(--color-border);
    --plant-tag-color-background: var(--color-border);
    --plant-tag-color: var(--color-fg);
    border: 1px solid var(--plant-color-border);
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
}
.plant.active {
    --plant-color-border: var(--color-highlight-primary);
    --plant-tag-color-background: var(--color-primary);
    --plant-tag-color: var(--color-bg);
}

.plant__tag {
    background-color: var(--plant-tag-color-background);
    padding: var(--unit-s);
    color: var(--plant-tag-color);
}

.plant__variety {
    padding: var(--unit-s);
    font-size: 14px;
    white-space: nowrap;
}
</style>

<script setup>
import { onMounted, reactive } from '@vue/runtime-core'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import BottomDrawer from '../components/BottomDrawer.vue'
import { usePlantRepository } from '../repository/plant.repository'
import { usePotRepository } from '../repository/pot.repository'

const potRepository = usePotRepository()
const plantRepository = usePlantRepository()
const router = useRouter()
const route = useRoute()

const data = reactive({
    pot: null,
    plants: []
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
    plantRepository.selectByPot(id).then((plants) => {
        data.plants = plants
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

</script>

<template>
<div>
    <div class="view">
        <h1>{{ data.pot?.name || '' }}</h1>
        <div class="column gap-m py-m">
            <div class="row gap-m py-s px-m scroll-x scroll--hidden">
                <div class="plant" v-for="plant of data.plants" :key="plant.id" @contextmenu.prevent="openPlantEdit(plant.id)">
                    <div class="plant__tag" v-if="plant.tag">{{ plant.tag }}</div>
                    <div class="plant__variety">{{ plant.variety }}</div>
                </div>
            </div>
            <div class="column">
                <div class="devider">Jan 2023</div>
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">1.5 l</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>26</div>
                        <div class="text-s">10:00</div>
                    </div>
                </div>
                <!-- <div class="devider">25 Jan 2023</div> -->
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">500 ml</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>25</div>
                        <div class="text-s">10:00</div>
                    </div>
                </div>
                <!-- <div class="devider">24 Jan 2023</div> -->
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">750 ml</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>24</div>
                        <div class="text-s">18:50</div>
                    </div>
                </div>
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">750 ml</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>24</div>
                        <div class="text-s">10:00</div>
                    </div>
                </div>
                <div class="devider">Dec 2022</div>
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">1.5 l</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>31</div>
                        <div class="text-s">08:10</div>
                    </div>
                </div>
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">1.5 l</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>31</div>
                        <div class="text-s">08:10</div>
                    </div>
                </div>
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">1.5 l</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>31</div>
                        <div class="text-s">08:10</div>
                    </div>
                </div>
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">1.5 l</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>31</div>
                        <div class="text-s">08:10</div>
                    </div>
                </div>
                <div class="row row--middle gap-m p-m">
                    <div class="event-icon">
                        <i class="icon icon-water-drop"></i>
                    </div>
                    <div class="column gap-s flex">
                        <div>Water</div>
                        <div class="text-secondary text-s">1.5 l</div>
                    </div>
                    <div class="column column--center text-idle">
                        <div>31</div>
                        <div class="text-s">08:10</div>
                    </div>
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

.event-icon {
    border: 1px solid var(--color-border);
    border-radius: 100%;
    padding: 4px;
}

.devider {
    position: relative;
    padding: var(--unit-m);
    text-align: right;
    color: var(--color-border);
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

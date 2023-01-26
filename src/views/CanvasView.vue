<script setup>
import { reactive, ref } from '@vue/reactivity'
import BottomDrawer from '../components/BottomDrawer.vue'
import PlantBox from '../components/PlantBox.vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import { useCanvasRepository } from '../repository/canvas.repository'
import { usePotRepository } from '../repository/pot.repository'

const canvasRepository = useCanvasRepository()
const potRepository = usePotRepository()
const route = useRoute()
const router = useRouter()

const data = reactive({
    canvas: null,
    tool: 'none',
    tapAt: -1,
    tapTimer: null,
})

let patchDelays = {}

const canvasView = ref(null)

function move(plant, event) {
    plant.x = Math.min(1, Math.max(0, plant.x + event.deltaX / canvasView.value.offsetWidth))
    plant.y = Math.min(1, Math.max(0, plant.y + event.deltaY / canvasView.value.offsetHeight))
    if (patchDelays[plant.id]) {
        clearTimeout(patchDelays[plant.id])
    }
    patchDelays[plant.id] = setTimeout(() => {
        potRepository.patch(plant.id, { x: plant.x, y: plant.y })
        patchDelays[plant.id] = null
    }, 120)
}

function toggleTool(tool) {
    if (data.tool == tool) {
        data.tool = 'none'
    } else {
        data.tool = tool
    }
}

function openHome() {
    router.push({ name: 'home' })
}

function tap(event) {
    if (data.tapTimer) {
        clearTimeout(data.tapTimer)
        data.tapTimer = null
        openHome()
        return
    }
    data.tapTimer = setTimeout(() => {
        data.tapTimer = null
        let position = {
            x: 0.5,
            y: 0.5
        }
        if (canvasView.value) {
            const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX
            const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY
            position.x = Math.min(1, Math.max(x / canvasView.value.offsetWidth, 0))
            position.y = Math.min(1, Math.max(y / canvasView.value.offsetHeight, 0))
        }
        router.push({ name: 'pot.new', query: { x: position.x, y: position.y } })
    }, 200)
}

function selectPot(pot) {
    if (data.tool == 'none') {
        router.push({ name: 'pot', params: { id: pot.id } })    
        return
    }
    router.push({ name: 'event.' + data.tool, params: { potId: pot.id } })
}

function load () {
    const id = parseInt(route.params.id)
    canvasRepository.select(id).then((canvas) => {
        data.canvas = canvas
    })
}

onBeforeRouteUpdate((to, from) => {
    if (to.name !== 'canvas') {
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
    <div class="view canvas"
        @click.stop="tap($event)"
        @contextmenu.prevent="openHome()"
        ref="canvasView">
        <div class="hint">
            <div class="row row--middle row--center gap-s"><i class="icon icon-tap"></i> tap to create</div>
            <div class="row row--middle row--center gap-s"><i class="icon icon-doubletap"></i> double tap to navigate</div>
        </div>
        <transition-group name="animation-row" duration="220" v-if="data.canvas">
            <plant-box v-for="pot in data.canvas.pots || []"
                :key="pot.id"
                :plant="pot"
                @move="move(pot, $event)"
                @select="selectPot(pot)"></plant-box>
        </transition-group>
    </div>
    <bottom-drawer :title="data.canvas ? data.canvas.name : '...'">
        <div class="row text-center gap-s p-s">
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('fertilizer')">
                <i class="icon icon--l icon-fertilizer" :class="{ 'text-idle': data.tool != 'fertilizer' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('water')">
                <i class="icon icon--l icon-water-drop" :class="{ 'text-idle': data.tool != 'water' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('cut')">
                <i class="icon icon--l icon-shears" :class="{ 'text-idle': data.tool != 'cut' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('plant')">
                <i class="icon icon--l icon-trowel" :class="{ 'text-idle': data.tool != 'plant' }"></i>
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
.hint {
    position: absolute;
    width: 100%;
    top: 20%;
    text-align: center;
    color: var(--color-border);
    font-size: 20px;
    display: flex;
    flex-direction: column;
    gap: var(--unit-m);
    font-weight: 100;
    opacity: 0.5;
}
.hint .icon {
    font-size: 52px;
}
.canvas {
    position: relative;
    width: 100vw;
    height: calc(100vh - 92.5px);
    overflow: hidden;
}

.canvas > * {
    position: absolute;
}

.plant {
    --shape-size: 80px;
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

.color {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    box-sizing: border-box;
    border: 1px solid var(--color-value);
}

.color:hover {
    border-width: 2px;
}

.color.color--active {
    background-color: var(--color-value);
}

.bottom-drawer-button {
    border-radius: 4px;
    padding: var(--unit-s);
    flex: 1;
}
</style>

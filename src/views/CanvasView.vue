<script setup>
import { reactive, ref } from '@vue/reactivity'
import BottomDrawer from '../components/BottomDrawer.vue'
import PlantBox from '../components/PlantBox.vue'
import { useCanvas } from '../stores/canvas'
import { useRoute, useRouter } from 'vue-router'

const canvas = useCanvas()
const route = useRoute()
const router = useRouter()

const data = reactive({
    tool: 'none',
    x: 0.5,
    y: 0.5,
    tapAt: -1,
    tapTimer: null,
})

const canvasView = ref(null)

function move(plant, event) {
    plant.x = Math.min(1, Math.max(0, plant.x + event.deltaX / canvasView.value.offsetWidth))
    plant.y = Math.min(1, Math.max(0, plant.y + event.deltaY / canvasView.value.offsetHeight))
}

function toggleTool(tool) {
    if (data.tool == tool) {
        data.tool = 'none'
    } else {
        data.tool = tool
    }
}

function createEvent() {
    
}

function tap(event) {
    if (data.tapTimer) {
        clearTimeout(data.tapTimer)
        data.tapTimer = null
        router.push({ name: 'home' })
        return
    }
    data.tapTimer = setTimeout(() => {
        data.tapTimer = null
        router.push({ name: 'pot.new' })
        if (canvasView.value) {
            const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX
            const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY
            data.x = Math.min(1, Math.max(x / canvasView.value.offsetWidth, 0))
            data.y = Math.min(1, Math.max(y / canvasView.value.offsetHeight, 0))
        }
    }, 200)
}

function create(event) {
    canvas.items[route.params.id].plants.push({
        id: 'test-1',
        name: event.name,
        volume: event.volume,
        color: event.color,
        shape: event.shape,
        x: data.x,
        y: data.y
    })
}

function selectPlant(plant) {
    if (data.tool == 'none') {
        return
    }
    router.push({ name: 'event.' + data.tool, params: { potId: plant.id } })
}
</script>

<template>
<div>
    <div class="view canvas"
        @click.stop="tap($event)"
        ref="canvasView">
        <div class="hint">
            <div class="row row--middle row--center gap-s"><i class="icon icon-tap"></i> tap to create</div>
            <div class="row row--middle row--center gap-s"><i class="icon icon-doubletap"></i> double tap to navigate</div>
        </div>
        <plant-box v-for="plant in canvas.items[route.params.id].plants"
            :key="plant.id"
            :plant="plant"
            @move="move(plant, $event)"
            @select="selectPlant(plant)"></plant-box>
    </div>
    <bottom-drawer title="Test">
        <div class="row text-center">
            <button type="button" class="flex p-m clickable" @click="toggleTool('fertilizer')">
                <i class="icon icon--l icon-fertilizer" :class="{ 'text-idle': data.tool != 'fertilizer' }"></i>
            </button>
            <button type="button" class="flex p-m clickable" @click="toggleTool('water')">
                <i class="icon icon--l icon-water-drop" :class="{ 'text-idle': data.tool != 'water' }"></i>
            </button>
            <button type="button" class="flex p-m clickable" @click="toggleTool('cut')">
                <i class="icon icon--l icon-shears" :class="{ 'text-idle': data.tool != 'cut' }"></i>
            </button>
            <button type="button" class="flex p-m clickable" @click="toggleTool('plant')">
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
    height: calc(100vh - 83px);
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

.plant--circle {
    margin: 0px;
    height: 64px;
    border-radius: 100%;
}
.plant--square {
    margin: 0px;
    height: 64px;
    border-radius: 12px;
}
.plant--rectangle {
    height: 32px;
    margin: 16px 0px;
    border-radius: 12px;
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
</style>

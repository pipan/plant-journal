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
    toolHints: {
        none: { icon: 'icon-tap', text: 'tap to create' },
        plant: { icon: 'icon-trowel', text: 'plant' },
        cut: { icon: 'icon-shears', text: 'cut' },
        fertilizer: { icon: 'icon-fertilizer', text: 'fertilize' },
        water: { icon: 'icon-water-drop', text: 'water' },
        note: { icon: 'icon-note', text: 'add note' },
        death: { icon: 'icon-skull', text: 'remove' },
    }
})

let patchDelays = {}

const canvasView = ref(null)

function move(pot, event) {
    let delta = {
        x: event.deltaX / canvasView.value.offsetWidth,
        y: event.deltaY / canvasView.value.offsetHeight
    }
    if (screen.orientation.angle === 90 || screen.orientation.angle === 270) {
        delta = {
            x: event.deltaY * -1 / canvasView.value.offsetHeight,
            y: event.deltaX / canvasView.value.offsetWidth
        }
    }
    if (screen.orientation.angle >= 180) {
        delta.x *= -1
        delta.y *= -1 
    }
    pot.x = Math.min(1, Math.max(0, pot.x + delta.x))
    pot.y = Math.min(1, Math.max(0, pot.y + delta.y))
    if (patchDelays[pot.id]) {
        clearTimeout(patchDelays[pot.id])
    }
    patchDelays[pot.id] = setTimeout(() => {
        potRepository.patch(pot.id, { x: pot.x, y: pot.y })
        patchDelays[pot.id] = null
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
}

function selectPot(pot) {
    if (data.tool == 'none') {
        router.push({ name: 'pot', params: { id: pot.id } })    
        return
    }
    router.push({ name: 'event.' + data.tool, params: { potId: pot.id } })
}

function openEdit(pot) {
    router.push({ name: 'pot.edit', params: { potId: pot.id } })
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
        v-hold
        @click.stop="tap($event)"
        @contextmenu.prevent="openHome()"
        ref="canvasView">
        <div class="hint">
            <transition  name="animation-row" duration="220" mode="out-in">
                <div class="row row--middle row--center gap-s" :key="data.tool"><i class="icon" :class="[data.toolHints[data.tool].icon]"></i> {{ data.toolHints[data.tool].text }}</div>
            </transition>
            <transition  name="animation-row" duration="220">
                <div class="row row--middle row--center gap-s" v-if="data.tool == 'none'"><i class="icon icon-doubletap"></i> hold to navigate</div>
            </transition>
        </div>
        <transition-group name="animation-row" duration="220" v-if="data.canvas">
            <plant-box v-for="pot in data.canvas.pots || []"
                :key="pot.id"
                :plant="pot"
                @move="move(pot, $event)"
                @select="selectPot(pot)"
                @selectHold="openEdit(pot)"></plant-box>
        </transition-group>
    </div>
    <bottom-drawer :title="data.canvas ? data.canvas.name : '...'">
        <div class="row text-center gap-s p-s">
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('plant')">
                <i class="icon icon--l icon-trowel" :class="{ 'color-trowel': data.tool == 'plant' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('cut')">
                <i class="icon icon--l icon-shears" :class="{ 'color-shears': data.tool == 'cut' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('fertilizer')">
                <i class="icon icon--l icon-fertilizer" :class="{ 'color-fertilize': data.tool == 'fertilizer' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('water')">
                <i class="icon icon--l icon-water-drop" :class="{ 'color-water': data.tool == 'water' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('note')">
                <i class="icon icon--l icon-note" :class="{ 'color-note': data.tool == 'note' }"></i>
            </button>
            <button type="button" class="bottom-drawer-button clickable" @click="toggleTool('death')">
                <i class="icon icon--l icon-skull" :class="{ 'color-skull': data.tool == 'death' }"></i>
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

.bottom-drawer-button {
    --color-value: var(--color-border);
    border-radius: 4px;
    padding: var(--unit-s);
    flex: 1;
}

.bottom-drawer-button .icon {
    color: var(--color-value);
}
</style>

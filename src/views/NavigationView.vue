<script setup>
import BottomDrawer from '../components/BottomDrawer.vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { onMounted, reactive } from '@vue/runtime-core'
import { useCanvasRepository } from '../repository/canvas.repository'


const canvasRepository = useCanvasRepository()
const router = useRouter()

const data = reactive({
    canvas: []
})

function open(id) {
    router.push({ name: 'canvas', params: { id: id } })
}

function openArchive() {
    router.push({ name: 'pot.list', params: { id: 'archive' } })
}

function openEdit(id) {
    router.push({ name: 'canvas.edit', params: { id: id } })
}

function load () {
    canvasRepository.selectAllActive().then((canvas) => {
        data.canvas = canvas
    })
}

onBeforeRouteUpdate((to, from) => {
    if (to.name !== 'home') {
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
        <div class="canvas-small"
            v-hold
            v-for="item in data.canvas"
            :key="item.id"
            @click="open(item.id)"
            @contextmenu.prevent="openEdit(item.id)">
            <div v-for="pot in item.pots" :key="pot.id"
                class="plant-small"
                :class="['color--' + pot.color, 'shape--' + pot.shape, pot.volume < 1000 ? 'volume--s' : pot.volume < 3000 ? 'volume--m' : 'volume--l']"
                :style="{ '--left': pot.x * 100 + '%', '--top': pot.y * 100 + '%' }"></div>
            <div class="canvas-name">{{ item.name }}</div>
        </div>
    </div>
    <bottom-drawer>
        <div class="row text-center gap-s p-s">
            <button type="button" class="bottom-drawer-button clickable" @click="openArchive()">
                <i class="icon icon--l icon-archive"></i>
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
.view {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: var(--unit-s);
    flex-wrap: wrap;
    padding: var(--unit-s);
    box-sizing: border-box;
    height: calc(100vh - 83px);
    width: 100vw;
}

.canvas-small {
    position: relative;
    box-sizing: border-box;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    height: calc(33.33% - 16px / 3);
    width: calc(33.33% - 16px / 3);
    transition: border-color 120ms ease;
    overflow: hidden;
}

.canvas-name {
    position: absolute;
    top: 25%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: var(--color-border);
    font-size: 12px;
    transition: color 120ms ease;
    user-select: none;
}

.plant-small {
    --shape-size: var(--unit-m);
    box-sizing: border-box;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    border: 2px solid var(--color-value);
    background-color: var(--color-bg);
    left: var(--left);
    top: var(--top);
}

.orientation-90 .plant-small {
    left: var(--top);
    top: calc(100% - var(--left));
}
.orientation-180 .plant-small {
    left: calc(100% - var(--left));
    top: calc(100% - var(--top));
}
.orientation-270 .plant-small {
    left: calc(100% - var(--top));
    top: var(--left);
}

.orientation-90 .canvas-small:nth-child(9n+1) { order: 7; }
.orientation-90 .canvas-small:nth-child(9n+2) { order: 4; }
.orientation-90 .canvas-small:nth-child(9n+3) { order: 1; }
.orientation-90 .canvas-small:nth-child(9n+4) { order: 8; }
.orientation-90 .canvas-small:nth-child(9n+5) { order: 5; }
.orientation-90 .canvas-small:nth-child(9n+6) { order: 2; }
.orientation-90 .canvas-small:nth-child(9n+7) { order: 9; }
.orientation-90 .canvas-small:nth-child(9n+8) { order: 6; }
.orientation-90 .canvas-small:nth-child(9n+9) { order: 3; }

.orientation-180 .canvas-small:nth-child(9n+1) { order: 9; }
.orientation-180 .canvas-small:nth-child(9n+2) { order: 8; }
.orientation-180 .canvas-small:nth-child(9n+3) { order: 7; }
.orientation-180 .canvas-small:nth-child(9n+4) { order: 6; }
.orientation-180 .canvas-small:nth-child(9n+5) { order: 5; }
.orientation-180 .canvas-small:nth-child(9n+6) { order: 4; }
.orientation-180 .canvas-small:nth-child(9n+7) { order: 3; }
.orientation-180 .canvas-small:nth-child(9n+8) { order: 2; }
.orientation-180 .canvas-small:nth-child(9n+9) { order: 1; }

.orientation-270 .canvas-small:nth-child(9n+1) { order: 3; }
.orientation-270 .canvas-small:nth-child(9n+2) { order: 6; }
.orientation-270 .canvas-small:nth-child(9n+3) { order: 9; }
.orientation-270 .canvas-small:nth-child(9n+4) { order: 2; }
.orientation-270 .canvas-small:nth-child(9n+5) { order: 5; }
.orientation-270 .canvas-small:nth-child(9n+6) { order: 8; }
.orientation-270 .canvas-small:nth-child(9n+7) { order: 1; }
.orientation-270 .canvas-small:nth-child(9n+8) { order: 4; }
.orientation-270 .canvas-small:nth-child(9n+9) { order: 7; }

.plant-small.volume--s { --shape-size: 12px; }
.plant-small.volume--m { --shape-size: 18px; }
.plant-small.volume--l { --shape-size: 24px; }

.plant-small.shape--rectangle {
    transform: translateX(-50%) translateY(-100%);
}

.bottom-drawer-button {
    border-radius: 4px;
    padding: var(--unit-s);
    flex: 1;
}
</style>

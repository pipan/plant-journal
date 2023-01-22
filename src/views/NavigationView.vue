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

function openEdit(id) {
    router.push({ name: 'canvas.edit', params: { id: id } })
}

function load () {
    canvasRepository.selectAll().then((canvas) => {
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
            v-for="item in data.canvas"
            :key="item.id"
            @click="open(item.id)"
            @contextmenu.prevent="openEdit(item.id)">
            <div v-for="pot in item.pots" :key="pot.id"
                class="plant-small"
                :class="['color--' + pot.color, 'shape--' + pot.shape, pot.volume < 1000 ? 'volume--s' : pot.volume < 3000 ? 'volume--m' : 'volume--l']"
                :style="{ left: pot.x * 100 + '%', top: pot.y * 100 + '%' }"></div>
            <div class="canvas-name">{{ item.name }}</div>
        </div>
    </div>
    <bottom-drawer>
        <div class="row text-center gap-s p-s">
            <button type="button" class="bottom-drawer-button clickable">JOURNAL</button>
            <button type="button" class="bottom-drawer-button clickable">STATS</button>
            <button type="button" class="bottom-drawer-button clickable">SETTINGS</button>
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
}

.canvas-small:hover {
    border-color: var(--color-highlight-primary);
}

.canvas-small:hover .canvas-name {
    color: var(--color-highlight-primary);
}

.plant-small {
    --shape-size: var(--unit-m);
    box-sizing: border-box;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    border: 2px solid var(--color-value);
    background-color: var(--color-bg);
}
.plant-small.volume--s { --shape-size: 12px; }
.plant-small.volume--m { --shape-size: 18px; }
.plant-small.volume--l { --shape-size: 24px; }

.plant-small.shape--rectangle {
    transform: translateX(-50%) translateY(-100%);
}

.bottom-drawer-button {
    border-radius: 4px;
    padding: 13px var(--unit-s);
    flex: 1;
}
</style>

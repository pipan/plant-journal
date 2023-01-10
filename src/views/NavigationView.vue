<script setup>
import BottomDrawer from '../components/BottomDrawer.vue'
import { useRouter } from 'vue-router'
import { useCanvas } from '../stores/canvas'
import { usePots } from '../stores/pots'

const canvas = useCanvas()
const pots = usePots()
const router = useRouter()

function open(index) {
    router.push({ name: 'zone', params: { id: index } })
}

function openEdit(index) {
    router.push({ name: 'zone.edit', params: { id: index } })
}

</script>

<template>
<div>
    <div class="view">
        <div class="canvas-small"
            v-for="item in canvas.items"
            :key="item.index"
            @click="open(item.index)"
            @contextmenu.prevent="openEdit(item.index)">
            <div v-for="potId in item.pots" :key="potId"
                class="plant-small"
                :class="['color--' + pots.items[potId].color, 'shape--' + pots.items[potId].shape]"
                :style="{ left: pots.items[potId].x * 100 + '%', top: pots.items[potId].y * 100 + '%' }"></div>
            <div class="canvas-name">{{ item.name }}</div>
        </div>
    </div>
    <bottom-drawer>
        <div class="row text-center">
            <button type="button" class="flex p-m clickable">JOURNAL</button>
            <button type="button" class="flex p-m clickable">STATS</button>
            <button type="button" class="flex p-m clickable">SETTINGS</button>
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

.plant-small.shape--rectangle {
    transform: translateX(-50%) translateY(-100%);
}
</style>

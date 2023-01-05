<script setup>
import BottomDrawer from '../components/BottomDrawer.vue'
import { useRouter } from 'vue-router'
import { useCanvas } from '../stores/canvas'

const canvas = useCanvas()
const router = useRouter()

function open(index) {
    router.push({ name: 'zone', params: { id: index } })
}

</script>

<template>
<div>
    <div class="view">
        <div class="canvas-small"
            v-for="item in canvas.items"
            :key="item.index"
            @click="open(item.index)">
            <div v-for="plant in item.plants" :key="plant.id"
                class="plant-small"
                :class="['color--' + plant.color, 'shape--' + plant.shape]"
                :style="{ left: plant.x * 100 + '%', top: plant.y * 100 + '%' }"></div>
        </div>
    </div>
    <bottom-drawer title="Test">
        <div class="row text-center">
            <button type="button" class="flex p-m clickable">JOURNAL</button>
            <button type="button" class="flex p-m clickable">STATS</button>
            <button type="button" class="flex p-m clickable">SETTINGS</button>
        </div>
    </bottom-drawer>
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

.canvas-small:hover {
    border-color: var(--color-highlight-primary);
}

.plant-small {
    --shape-size: var(--unit-m);
    box-sizing: border-box;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    border: 2px solid var(--color-value);
    background-color: var(--color-bg);
}
</style>

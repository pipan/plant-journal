<script setup>
import { reactive, ref } from '@vue/reactivity'
import BottomDrawer from '../components/BottomDrawer.vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import { useCanvasRepository } from '../repository/canvas.repository'

const canvasRepository = useCanvasRepository()
const route = useRoute()
const router = useRouter()

const data = reactive({
    canvas: null
})

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'home' })
    }
    router.go(-1)
}

function openPot(pot) {
    router.push({ name: 'pot', params: { id: pot.id } })    
}

function openEdit(pot) {
    router.push({ name: 'pot.list.edit', params: { potId: pot.id } })
}

function load () {
    const id = route.params.id
    canvasRepository.select(id).then((canvas) => {
        data.canvas = canvas
    })
}

onBeforeRouteUpdate((to, from) => {
    if (to.name !== 'pot.list') {
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
    <div class="view column">
        <div class="column" v-if="data.canvas && data.canvas.pots.length > 0">
            <div class="row row--middle px-l py-m gap-m clickable" 
                v-for="pot of data.canvas.pots" :key="pot.id"
                v-hold
                @click="openPot(pot)"
                @contextmenu.prevent.stop="openEdit(pot)">
                <div class="plant" :class="['color--' + pot.color, 'shape--' + pot.shape]"></div>
                <div class="column gap-s">
                    <div>{{ pot.name }}</div>
                    <div class="text-secondary text-s">{{ pot.archiveAt.toLocaleDateString() }}</div>
                </div>
            </div>
        </div>
        <div class="column flex column--middle column--center" v-if="!data.canvas || data.canvas.pots.length === 0">
            <div class="p-l text-secondary">
                Your archive is empty
            </div>
        </div>
    </div>
    <bottom-drawer :title="data.canvas ? data.canvas.name : '...'">
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
.plant {
    --shape-size: 40px;
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
    border-radius: 4px;
    padding: var(--unit-s);
    flex: 1;
}

.holdable {
    user-select: none;
}
</style>

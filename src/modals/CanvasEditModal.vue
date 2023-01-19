<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import InputField from '../components/InputField.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import { useCanvasRepository } from '../repository/canvas.repository'

const canvasRepository = useCanvasRepository()
const route = useRoute()
const router = useRouter()

const data = reactive({
    name: ''
})

function save() {
    const id = parseInt(route.params.id)
    canvasRepository.patch(id, { name: data.name }).then(() => {
        this.close()
    })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'home' })
    }
    router.go(-1)
}

onMounted(() => {
    const id = parseInt(route.params.id)
    canvasRepository.select(id).then((canvas) => {
        data.name = canvas.name
    })
})
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m column gap-l">
        <input-field placeholder="Name" :value="data.name" @change="data.name = $event"></input-field>
        <div class="row row--center gap-l">
            <button type="button" class="btn-circle" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
            <button type="button" class="btn-circle btn-circle--primary" @click="save()">
                <i class="icon icon--l icon-check"></i>
            </button>
        </div>
    </div>
</modal>
</template>

<style scoped>
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
</style>

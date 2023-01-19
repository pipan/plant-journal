<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import InputField from '../components/InputField.vue'
import InputSlider from '../components/InputSlider.vue'
import ShapeSelect from '../components/ShapeSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { useScale } from '../services/scale'
import { computed } from '@vue/runtime-core'
import { usePotRepository } from '../repository/pot.repository'

const potRepository = usePotRepository()
const route = useRoute()
const router = useRouter()
const scale = useScale([0.0, 0.5, 1.0], [0, 3000, 10000])

const data = reactive({
    name: '',
    volumeNorm: scale.norm(0),
    color: 'orange',
    shape: 'circle',
})

const volume = computed(() => {
    return scale.mapRound(data.volumeNorm, [100, 250])
})

const unit = computed(() => {
    return volume.value >= 1000 ? 'l' : 'ml'
})
const volumeDisplayValue = computed(() => {
    return volume.value >= 1000 ? (Math.round(volume.value / 10) / 100).toFixed(2) : volume.value
})

function create() {
    const pot = {
        canvasId: parseInt(route.params.id),
        name: data.name,
        volume: volume.value,
        color: data.color,
        shape: data.shape,
        x: parseFloat(route.query.x),
        y: parseFloat(route.query.y)
    }
    potRepository.insert(pot).then(() => {
        this.close()
    }).catch((err) => {
        console.error('err', err)
    })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'zone' })
    }
    router.go(-1)
}
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m column gap-l">
        <input-field placeholder="Name" :value="data.name" @change="data.name = $event"></input-field>
        <div class="row row--center">
            <div class="plant" :class="['shape--' + data.shape, 'color--' + data.color]">
                <div>{{ volumeDisplayValue }}</div>
                <div class="text-s text-secondary">{{ unit }}</div>
            </div>
        </div>
        <div class="row row--center">
            <div class="w-80">
                <input-slider :value="data.volumeNorm" @change="data.volumeNorm = $event"></input-slider>
            </div>
        </div>
        
        <shape-select :value="data.shape" @change="data.shape = $event"></shape-select>
        <div class="row row--middle row--center gap-m">
            <div class="color color--red" :class="{ 'color--active': data.color == 'red' }" @click="data.color = 'red'"></div>
            <div class="color color--orange" :class="{ 'color--active': data.color == 'orange' }" @click="data.color = 'orange'"></div>
            <div class="color color--blue" :class="{ 'color--active': data.color == 'blue' }" @click="data.color = 'blue'"></div>
            <div class="color color--purple" :class="{ 'color--active': data.color == 'purple' }" @click="data.color = 'purple'"></div>
        </div>
        <div class="row row--center gap-l">
            <button type="button" class="btn-circle" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
            <button type="button" class="btn-circle btn-circle--primary" @click="create()">
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--unit-s);
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

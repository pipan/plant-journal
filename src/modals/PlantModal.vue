<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import InputField from '../components/InputField.vue'
import InputSlider from '../components/InputSlider.vue'
import ShapeSelect from '../components/ShapeSelect.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
    name: '',
    volume: 0,
    color: 'orange',
    shape: 'circle',
})

function create() {
    // emit('submit', {
    //     name: data.name,
    //     volume: data.volume,
    //     color: data.color,
    //     shape: data.shape
    // })
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
            <div class="plant" :class="['shape--' + data.shape, 'color--' + data.color]">{{ Math.round(data.volume * 10) }}l</div>
        </div>
        <div class="row row--center">
            <div class="w-50">
                <input-slider :value="data.volume" @change="data.volume = $event"></input-slider>
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

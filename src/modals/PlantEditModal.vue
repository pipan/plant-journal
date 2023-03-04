<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import InputField from '../components/InputField.vue'
import TagInput from '../components/TagInput.vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted } from '@vue/runtime-core'
import { usePlantRepository } from '../repository/plant.repository'

const plantRepository = usePlantRepository()
const route = useRoute()
const router = useRouter()

const data = reactive({
    variety: '',
    tag: '',
    withTag: false,
    inputAlign: 'center'
})

function save() {
    const id = parseInt(route.params.plantId)
    plantRepository.patch(id, { variety: data.variety, tag: data.withTag ? data.tag : '' }).then(() => {
        close()
    })
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'home' })
    }
    router.go(-1)
}

onMounted(() => {
    const id = parseInt(route.params.plantId)
    plantRepository.select(id).then((plant) => {
        data.variety = plant.variety
        data.tag = plant.tag || 'A'
        data.withTag = plant.tag !== ''
        data.inputAlign = data.withTag ? 'left' : 'center'
    })
})
</script>

<template>
<modal @outside-click="close()">
    <form class="p-m column gap-l" @submit.prevent="save()">
        <div class="column">
            <div class="row row--end row--middle">
                <button type="button" class="btn-icon" :class="{'btn-icon--active': data.withTag}" @click="data.withTag = !data.withTag">
                    <i class="icon icon-bookmark icon--l"></i>
                </button>
            </div>
            <div class="row row--middle gap-l">
                <transition name="animation-row" duration="300" @before-enter="data.inputAlign = 'left'" @after-leave="data.inputAlign = 'center'">
                    <tag-input v-if="data.withTag" :value="data.tag" @change="data.tag = $event"></tag-input>
                </transition>
                <input-field placeholder="Variety" :value="data.variety" :align="data.inputAlign" @change="data.variety = $event"></input-field>
            </div>
        </div>
        <div class="row row--center gap-l">
            <button type="button" class="btn-circle" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
            <button type="submit" class="btn-circle btn-circle--primary">
                <i class="icon icon--l icon-check"></i>
            </button>
        </div>
    </form>
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

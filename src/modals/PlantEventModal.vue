<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import InputField from '../components/InputField.vue'
import RadioSelect from '../components/RadioSelect.vue'
import NumberInput from '../components/NumberInput.vue'
import TagInput from '../components/TagInput.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlant } from '../services/plant'
import { onMounted } from '@vue/runtime-core'

const plantService = usePlant()
const router = useRouter()
const route = useRoute()

const data = reactive({
    datetime: new Date(),
    datetimeVisible: false,
    withTag: true,
    plantType: 'pot',
    plantOptions: [{ id: 'pot', name: 'pot' }, { id: 'seed', name: 'seed' }, { id: 'cutting', name: 'cutting' }, { id: 'plant', name: 'plant' }],
    items: [],
    newPlantTypes: ['seed', 'cutting', 'plant']
})

function create() {
    if (!isNewPlantType()) {
        console.log("TODO: not new plant")
    } else {
        if (data.items.length === 0) {
            console.log("TODO: validate error / disable button")
            return
        }
        const potId = parseInt(route.params.potId)
        for (let item of data.items) {
            if (!item.variety) {
                continue
            }
            let plantData = { potId: potId, variety: item.variety, tag: item.tag, type: data.plantType }
            let eventData = { type: 'plant', plantType: data.plantType, createdAt: data.datetimeVisible ? data.datetime : new Date() }
            if (data.withTag) {
                plantService.create(plantData, eventData)
            } else {
                plantData.tag = ''
                plantService.createBatch(plantData, item.count, eventData)
            }
        }
    }
    close()
}

function addItem() {
    let tag = 'A'
    if (data.items.length > 0) {
        const nextCharCode = data.items[data.items.length - 1].tag.charCodeAt(0) + 1
        if (nextCharCode <= "Z".charCodeAt(0)) {
            tag = String.fromCharCode(nextCharCode)
        }
    }
    
    data.items.push({ count: 1, tag: tag, variety: '' })
}

function isNewPlantType() {
    return data.newPlantTypes.indexOf(data.plantType) > -1
}

function removeItem(index) {
    data.items.splice(index, 1)
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'zone' })
    }
    router.go(-1)
}

onMounted(() => {
    addItem()
})
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m column gap-l">
        <div class="pos-r row row--center row--middle">
            <i class="icon icon-trowel icon--l color-trowel"></i>
            <div class="pos-a pos-right row">
                <button type="button" class="btn-icon" :class="{'btn-icon--active': data.withTag}" @click="data.withTag = !data.withTag">
                    <i class="icon icon-bookmark icon--l"></i>
                </button>
                <button type="button" class=" btn-icon" :class="{'btn-icon--active': data.datetimeVisible}" @click="data.datetimeVisible = !data.datetimeVisible">
                    <i class="icon icon-clock icon--l"></i>
                </button>
            </div>
        </div>
        <transition name="animation-row" duration="220">
            <datetime-input v-if="data.datetimeVisible"
                :value="data.datetime"
                @change="data.datetime = $event"></datetime-input>
        </transition>
        <radio-select :options="data.plantOptions" :value="data.plantType" @change="data.plantType = $event"></radio-select>

        <div class="column gap-m" v-if="isNewPlantType()">
            <transition-group name="animation-row" duration="220" appear>
                <div class="row row--middle gap-m" v-for="(item, index) of data.items" :key="item">
                    <number-input v-if="!data.withTag" :sensitivity="1.5" sufix="x" :value="item.count" @change="item.count = $event" :max="30"></number-input>
                    <tag-input v-if="data.withTag" :value="item.tag" @change="item.tag = $event"></tag-input>
                    <input-field placeholder="Variety" :value="item.variety" @change="item.variety = $event"></input-field>
                    <button type="button" class="btn-circle btn-circle--no-border shrink-0" @click="removeItem(index)">
                        <i class="icon icon--l icon-close"></i>
                    </button>
                </div>
            </transition-group>
            <button type="button" class="btn-circle btn-circle--no-border" @click="addItem()">
                <i class="icon icon--l icon-plus"></i>
            </button>
        </div>

        <div class="column gap-m" v-if="!isNewPlantType()">
            Not new plant
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
.icon-trowel {
    color: var(--color-value);
}
</style>

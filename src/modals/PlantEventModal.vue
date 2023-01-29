<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import DatetimeInput from '../components/DatetimeInput.vue'
import InputField from '../components/InputField.vue'
import RadioSelect from '../components/RadioSelect.vue'
import NumberInput from '../components/NumberInput.vue'
import PlantSelect from '../components/PlantSelect.vue'
import TagInput from '../components/TagInput.vue'
import SelectField from '../components/SelectField.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlant } from '../services/plant'
import { computed, onMounted } from '@vue/runtime-core'
import { usePotRepository } from '../repository/pot.repository'
import { usePlantRepository } from '../repository/plant.repository'
import { useCanvasRepository } from '../repository/canvas.repository'

const plantService = usePlant()
const potRepository = usePotRepository()
const plantRepository = usePlantRepository()
const canvasRepository = useCanvasRepository()
const router = useRouter()
const route = useRoute()

const data = reactive({
    datetime: new Date(),
    datetimeVisible: false,
    withTag: true,
    items: [],
    plantType: 'pot',
    plantOptions: [{ id: 'pot', name: 'pot' }, { id: 'seed', name: 'seed' }, { id: 'cutting', name: 'cutting' }, { id: 'plant', name: 'plant' }],
    newPlantTypes: ['seed', 'cutting', 'plant'],
    forwardDirection: true,
    source: {
        pot: null
    },
    target: {
        selectedCanvasId: 0,
        selectedPotId: 0
    },
    canvas: [],
    plants: [],
    selectedPlants: []
})

const targetCanvas = computed(() => {
    return getCanvasById(data.target.selectedCanvasId)
})

function create() {
    let eventData = { plantType: data.plantType, createdAt: data.datetimeVisible ? data.datetime : new Date() }
    if (!isNewPlantType()) {
        const sourcePotId = parseInt(route.params.potId)
        if (data.target.selectedPotId == sourcePotId) {
            // todo validation error
            return
        }
        plantService.move(data.selectedPlants, data.target.selectedPotId, eventData)
    } else {
        if (data.items.length === 0) {
            console.log("TODO: validate error / disable button")
            return
        }
        eventData.type = 'plantIn'
        const potId = parseInt(route.params.potId)
        for (let item of data.items) {
            if (!item.variety) {
                continue
            }
            let plantData = { potId: potId, variety: item.variety, tag: item.tag, type: data.plantType }
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

function getCanvasById(id) {
    for (let item of data.canvas) {
        if (item.id == data.target.selectedCanvasId) {
            return item
        }
    }
    return null
}

function toggleDirection() {
    data.forwardDirection = !data.forwardDirection
    loadPlants()
}

function setTargetPot(id) {
    data.target.selectedPotId = parseInt(id)
    loadPlants()
}

function setTargetCanvas(id) {
    data.target.selectedCanvasId = parseInt(id)
    const canvas = getCanvasById(data.target.selectedCanvasId)
    if (!canvas) {
        return setTargetPot(0)
    }
    setTargetPot(canvas.pots.length > 0 ? canvas.pots[0].id : 0)
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

function loadPot() {
    const id = parseInt(route.params.potId)
    return potRepository.select(id).then((pot) => {
        data.source.pot = pot
        return pot
    })
}

function loadCanvas() {
    const id = parseInt(route.params.id)
    return canvasRepository.select(id).then((canvas) => {
        data.canvas = canvas
        return canvas
    })
}

function loadPlants() {
    let potId = 0
    if (data.forwardDirection) {
        potId = parseInt(route.params.potId)
    } else {
        potId = data.target.selectedPotId
    }
    if (potId === 0) {
        data.plants = []
        return
    }
    plantRepository.selectActiveByPot(potId).then((plants) => {
        data.plants = plants
    })
}

function isNewPlantType() {
    return data.newPlantTypes.indexOf(data.plantType) > -1
}

function removeItem(index) {
    data.items.splice(index, 1)
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'canvas' })
    }
    router.go(-1)
}

onMounted(() => {
    data.target.selectedCanvasId = parseInt(route.params.id)
    data.target.selectedPotId = parseInt(route.params.potId)
    addItem()
    loadPot().then(() => {
        loadPlants()
    })
    loadCanvas()
})
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m column gap-l">
        <div class="pos-r row row--center row--middle">
            <i class="icon icon-trowel icon--l color-trowel"></i>
            <div class="pos-a pos-right row">
                <transition name="animation-row" duration="220" appear>
                    <button type="button" class="btn-icon" v-if="isNewPlantType()"
                        :class="{'btn-icon--active': data.withTag}"
                        @click="data.withTag = !data.withTag">
                        <i class="icon icon-bookmark icon--l"></i>
                    </button>
                </transition>
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

        <transition name="animation-row" duration="220" mode="out-in" appear>
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

            <div class="column gap-s" v-else-if="!isNewPlantType()">
                <div class="row gap-s">
                    <div class="column gap-s flex column--end">
                        <input-field v-if="data.source.pot" :value="data.source.pot.name" :disabled="true"></input-field>
                    </div>
                    <div class="row row--middle">
                        <button type="button" class=" btn-icon btn-icon--active" @click="toggleDirection()">
                            <i class="icon icon--l icon-arrow-right" :class="{'rotate-180': !data.forwardDirection}"></i>
                        </button>
                    </div>
                    <div class="column gap-s flex">
                        <select-field :value="data.target.selectedCanvasId"
                            :options="data.canvas"
                            @change="setTargetCanvas($event)"></select-field>
                        <select-field :value="data.target.selectedPotId"
                            :options="targetCanvas ? targetCanvas.pots : []"
                            @change="setTargetPot($event)"></select-field>
                    </div>
                </div>
                <plant-select align="center"
                    :value="data.selectedPlants"
                    :options="data.plants"
                    @change="data.selectedPlants = $event"></plant-select>
            </div>
        </transition>

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

.icon-arrow-right {
    transition: transform 160ms ease;
}
</style>

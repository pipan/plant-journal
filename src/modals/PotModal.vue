<script setup>
import { reactive } from '@vue/reactivity'
import Modal from '../components/Modal.vue'
import InputField from '../components/InputField.vue'
import SelectField from '../components/SelectField.vue'
import InputSlider from '../components/InputSlider.vue'
import ShapeSelect from '../components/ShapeSelect.vue'
import ColorHueInput from '../components/ColorHueInput.vue'
import { useScale } from '../services/scale'
import { computed, onMounted } from '@vue/runtime-core'
import { useCanvasRepository } from '../repository/canvas.repository'
import { getHueList, hslCss } from '../services/color'

const canvasRepo = useCanvasRepository()
const scale = useScale([0.0, 0.5, 1.0], [0, 3000, 10000])

const props = defineProps({
    pot: { type: Object, default: () => { return {} }},
    canManage: { type: Boolean, default: false }
})

const data = reactive({
    name: '',
    volumeNorm: scale.norm(0),
    hue: 0,
    shape: 'circle',
    managementAction: '',
    selectedCanvasId: 0,
    management: false,
    canvas: [],
    hues: []
})

const emit = defineEmits(['close', 'submit', 'manage'])

const dataVolume = computed(() => {
    return scale.mapRound(data.volumeNorm, [100, 250])
})

const unit = computed(() => {
    return dataVolume.value >= 1000 ? 'l' : 'ml'
})
const volumeDisplayValue = computed(() => {
    return dataVolume.value >= 1000 ? (Math.round(dataVolume.value / 10) / 100).toFixed(2) : dataVolume.value
})

function hueColor(value) {
    return hslCss(value)
}

function create() {
    if (data.management) {
        emit('manage', { action: data.managementAction, canvasId: data.selectedCanvasId })
    } else {
        const pot = {
            name: data.name,
            volume: dataVolume.value,
            hue: data.hue,
            shape: data.shape
        }
        emit('submit', pot)
    }
}

function toggleManagementAction(value) {
    if (value == data.managementAction) {
        data.managementAction = ''
    } else {
        data.managementAction = value
    }
}

function close() {
    emit('close')
}

onMounted(() => {
    data.name = props.pot.name || ''
    data.volumeNorm = scale.norm(props.pot.volume || 0)
    data.hue = props.pot.hue !== undefined ? props.pot.hue : 30
    data.shape = props.pot.shape || 'circle'
    data.selectedCanvasId = props.pot.canvasId || 0
    canvasRepo.selectAllActive().then((canvas) => {
        data.canvas = canvas
    })
    getHueList().then((hues) => {
        data.hues = hues
    })
})
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m">
        <div class="pos-r row row--end row--middle" v-if="canManage">
            <button type="button" class=" btn-icon" :class="{'btn-icon--active': data.management}" @click="data.management = !data.management">
                <i class="icon icon-cog icon--l"></i>
            </button>
        </div>
        <form class="column gap-l" @submit.prevent="create()">
            <transition name="animation-row" duration="220" mode="out-in" appear>
                <div class="column gap-l" v-if="!data.management">
                    <input-field placeholder="Pot name" :value="data.name" @change="data.name = $event"></input-field>
                    <div class="row row--center">
                        <div class="plant" :class="['shape--' + data.shape]"
                            :style="{'border-color': hueColor(data.hue)}">
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
                        <color-hue-input :value="data.hue"
                            :saturation="65"
                            :lightness="50"
                            @change="data.hue = $event"></color-hue-input>
                        <div class="row row--middle gap-m scroll-x scroll--hidden">
                            <div class="color" v-for="hue of data.hues" :key="hue"
                                :style="{'--color-value': hueColor(hue)}"
                                :class="{ 'color--active': data.hue == hue }" 
                                @click="data.hue = hue"></div>
                        </div>
                    </div>
                </div>
                <div class="column" v-else-if="data.management">
                    <div class="row row--middle py-m" v-if="!pot.archiveAt">
                        <select-field :value="data.selectedCanvasId"
                            :options="data.canvas"
                            @change="data.selectedCanvasId = $event"></select-field>
                    </div>
                    <div class="row row--middle gap-l p-m clickable" v-if="pot.archiveAt"
                        :class="{'active': data.managementAction == 'recover'}"
                        @click="toggleManagementAction('recover')">
                        <i class="icon icon-archive icon--l" :class="[data.managementAction == 'recover' ? '' : 'text-idle']"></i>
                        <div class="column">
                            <div>Recover</div>
                            <div class="text-secondary text-s">Recover pot, all plants and events from archive</div>
                        </div>
                    </div>
                    <div class="row row--middle gap-l p-m clickable" v-if="!pot.archiveAt"
                        :class="{'active': data.managementAction == 'archive'}"
                        @click="toggleManagementAction('archive')">
                        <i class="icon icon-archive icon--l" :class="[data.managementAction == 'archive' ? '' : 'text-idle']"></i>
                        <div class="column">
                            <div>Archive</div>
                            <div class="text-secondary text-s">Move this pot, all plants and events to archive</div>
                        </div>
                    </div>
                    <div class="row row--middle gap-l p-m clickable" v-if="!pot.archiveAt"
                        @click="toggleManagementAction('delete')">
                        <i class="icon icon-bin icon--l" :class="[data.managementAction == 'delete' ? 'text-warn' : 'text-idle']"></i>
                        <div class="column">
                            <div>Delete</div>
                            <div class="text-secondary text-s">Permanently remove this pot, all plants and events</div>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="row row--center gap-l">
                <button type="button" class="btn-circle" @click="close()">
                    <i class="icon icon--l icon-close"></i>
                </button>
                <button type="primary" class="btn-circle btn-circle--primary">
                    <i class="icon icon--l icon-check"></i>
                </button>
            </div>
        </form>
    </div>
</modal>
</template>

<style scoped>
.plant {
    --shape-size: 80px;
    border: 3px solid;
    box-sizing: border-box;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-bg);
    transition: border-radius 120ms ease, height 120ms ease, width 120ms ease, margin 120ms ease, border-color 120ms ease;
}

.color {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    box-sizing: border-box;
    border: 1px solid var(--color-value);
    flex-shrink: 0;
}

.color:hover {
    border-width: 2px;
}

.color.color--active {
    background-color: var(--color-value);
}

.icon-sliders {
    font-size: 14px;
}
</style>

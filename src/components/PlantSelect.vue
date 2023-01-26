<script setup>
import { computed } from '@vue/runtime-core'

const emit = defineEmits(['change', 'select'])

const config = {
    alignments: {
        inline: {
            row: ['row', 'scroll-x', 'scroll-hidden']
        },
        center: {
            row: ['row', 'row--wrap', 'row--center']
        }
    }
}

const props = defineProps({
    options: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    align: { type: String, default: 'center' }
})

const alignment = computed(() => {
    return config.alignments[props.align]
})

function toggleValue(id) {
    let copy = [...props.value]
    const index = copy.indexOf(id)
    if (index > -1) {
        copy.splice(index, 1)
    } else {
        copy.push(id)
    }
    emit('change', copy)
}

function select(plant) {
    emit('select', plant)
}
</script>

<template>
    <div class="gap-m py-s px-m" :class="alignment.row">
        <div class="plant" v-for="plant of options" :key="plant.id"
            :class="value.indexOf(plant.id) > -1 ? 'active' : ''"
            @click="toggleValue(plant.id)"
            @contextmenu.prevent="select(plant)">
            <div class="plant__tag" v-if="plant.tag">{{ plant.tag }}</div>
            <div class="plant__variety">{{ plant.variety }}</div>
        </div>
    </div>
</template>

<style scoped>
.plant {
    --plant-color-border: var(--color-border);
    --plant-tag-color-background: var(--color-border);
    --plant-tag-color: var(--color-fg);
    border: 1px solid var(--plant-color-border);
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
}
.plant.active {
    --plant-color-border: var(--color-highlight-primary);
    --plant-tag-color-background: var(--color-primary);
    --plant-tag-color: var(--color-bg);
}

.plant__tag {
    background-color: var(--plant-tag-color-background);
    padding: var(--unit-s);
    color: var(--plant-tag-color);
}

.plant__variety {
    padding: var(--unit-s);
    font-size: 14px;
    white-space: nowrap;
}
</style>
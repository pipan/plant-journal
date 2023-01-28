<script setup>
import { computed } from '@vue/runtime-core'

const emit = defineEmits(['change', 'select'])

const config = {
    alignments: {
        inline: {
            row: ['row', 'scroll-x', 'scroll--hidden', 'gap-m', 'px-m']
        },
        center: {
            row: ['row', 'flex--wrap', 'row--center', 'gap-m', 'py-s', 'px-m']
        },
        list: {
            row: ['column', 'gap-s']
        }
    }
}

const props = defineProps({
    options: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] },
    align: { type: String, default: 'center' },
    holdable: { type: Boolean, default: false }
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
    <div :class="alignment.row">
        <div class="plant clickable" v-for="plant of options" :key="plant.id"
            :class="{'active': value.indexOf(plant.id) > -1 }"
            v-hold="holdable"
            @click="toggleValue(plant.id)"
            @contextmenu.prevent="select(plant)">
            <div class="plant__tag" v-if="plant.tag">{{ plant.tag }}</div>
            <div class="plant__variety">{{ plant.variety }}</div>
        </div>
    </div>
</template>

<style scoped>
.plant {
    position: relative;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    padding: 0px 4px;
    cursor: pointer;
    user-select: none;
}

.plant__tag {
    background-color: var(--color-border);
    padding: 2px 4px;
    color: var(--color-bg);
    border-radius: 4px;
}
.plant.active .plant__tag {
    color: var(--color-highlight-primary);
}

.plant__variety {
    padding: var(--unit-s);
    font-size: 12px;
    white-space: nowrap;
    color: var(--color-fg-secondary);
}
.plant.active .plant__variety {
    color: var(--color-highlight-primary);
}
</style>
<script setup>
import { ref } from 'vue'
import { reactive } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core'

const props = defineProps({
    value: String
})
const emit = defineEmits(['change'])

function setValue(value) {
    if (value == props.value) {
        return
    }
    emit('change', value)
}

</script>

<template>
    <div class="row row--middle row--center gap-m">
        <div class="shape shape-circle" tabindex="0"
            :class="{ 'shape--active': value == 'circle' }"
            @click="setValue('circle')"
            @keypress.enter="setValue('circle')"></div>
        <div class="shape shape-square" tabindex="0"
            :class="{ 'shape--active': value == 'square' }"
            @click="setValue('square')"
            @keypress.enter="setValue('square')"></div>
        <div class="shape shape-rectangle" tabindex="0"
            :class="{ 'shape--active': value == 'rectangle' }"
            @click="setValue('rectangle')"
            @keypress.enter="setValue('rectangle')"></div>
        <div class="shape shape-rectangle90" tabindex="0"
            :class="{ 'shape--active': value == 'rectangle90' }"
            @click="setValue('rectangle90')"
            @keypress.enter="setValue('rectangle90')"></div>
    </div>
</template>

<style scoped>
.shape-circle {
    width: 32px;
    height: 32px;
    border-radius: 100%;
}

.shape-square {
    width: 32px;
    height: 32px;
    border-radius: 4px;
}

.shape-rectangle {
    width: 32px;
    height: 16px;
    border-radius: 4px;
}

.shape-rectangle90 {
    width: 16px;
    height: 32px;
    border-radius: 4px;
}

.shape {
    box-sizing: border-box;
    border: 1px solid var(--color-border);
}

.shape:hover {
    border-width: 2px;
}

.shape:focus {
    outline: none;
    border-color: var(--color-highlight-primary);
}

.shape--active {
    border-width: 2px;
    border-color: var(--color-fg-secondary);
}
</style>
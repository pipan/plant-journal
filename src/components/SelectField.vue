<script setup>
import { reactive } from '@vue/reactivity'

const emit = defineEmits(['change'])

const props = defineProps({
    value: { type: [String, Number] },
    options: { type: Array, default: () => [] }
})

const data = reactive({
    isFocused: false
})

function change(value) {
    if (value == props.value) {
        return
    }
    emit('change', value)
}
</script>

<template>
    <div class="select-field" :class="{ 'select-field--focus': data.isFocused }">
        <select :value="value"
            @focus="data.isFocused = true"
            @blur="data.isFocused = false"
            @change="change($event.target.value)">
            <option v-for="item of options" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
    </div>
</template>

<style scoped>
.select-field {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.select-field::before {
    content: '';
    position: absolute;
    bottom: 0px;
    width: 70px;
    height: 1px;
    background-color: var(--color-border);
    transition: width 120ms ease-out, transform 120ms ease-in, background-color 120ms ease;
}

.select-field.select-field--focus::before {
    width: 100%;
    transform: translateX(0%);
    transition: width 120ms ease-in, transform 120ms ease-out, background-color 120ms ease;
    background-color: var(--color-highlight-primary);
}

.select-field:hover::before {
    background-color: var(--color-highlight-primary);
}

.select-field select {
    box-sizing: border-box;
    width: 100%;
    padding: var(--unit-s);
    border: none;
    background-color: transparent;
    text-align: center;
    color: var(--color-fg);
    outline: none;
    font-size: 16px;
}
</style>
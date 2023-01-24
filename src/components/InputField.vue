<script setup>
import { reactive } from '@vue/reactivity'

const emit = defineEmits(['change'])

const props = defineProps({
    placeholder: { type: String },
    value: { type: String },
    mode: { type: String, default: 'text' },
    align: { type: String, default: 'center' }
})

const data = reactive({
    isFocused: false
})

function change(value) {
    emit('change', value)
}
</script>

<template>
    <div class="input-field" :class="{ 'input-field--focus': data.isFocused, 'input-field--left': align === 'left' }">
        <input :type="mode"
            :placeholder="placeholder"
            :value="value"
            @focus="data.isFocused = true"
            @blur="data.isFocused = false"
            @input="change($event.target.value)" />
    </div>
</template>

<style scoped>
.input-field {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.input-field::before {
    content: '';
    position: absolute;
    bottom: 0px;
    width: 70px;
    height: 1px;
    background-color: var(--color-border);
    transition: width 120ms ease-out, transform 120ms ease-in, background-color 120ms ease;
}

.input-field.input-field--focus::before {
    width: 100%;
    transform: translateX(0%);
    transition: width 120ms ease-in, transform 120ms ease-out, background-color 120ms ease;
    background-color: var(--color-highlight-primary);
}

.input-field:hover::before {
    background-color: var(--color-highlight-primary);
}

.input-field input {
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
.input-field.input-field--left input {
    text-align: left;
}
.input-field.input-field--left {
    align-items: flex-start;
}
</style>
<script setup>
import { reactive } from '@vue/reactivity'

const emit = defineEmits(['change'])

const props = defineProps({
    placeholder: { type: String },
    value: { type: String },
    mode: { type: String, default: 'text' }
})

const data = reactive({
    isFocused: false
})

function change(value) {
    emit('change', value)
}
</script>

<template>
    <div class="input-field" :class="{ 'input-field--focus': data.isFocused }">
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
}

.input-field::before {
    content: '';
    position: absolute;
    bottom: 0px;
    width: 25%;
    height: 1px;
    background-color: var(--color-border);
    transform: translateX(150%);
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
</style>
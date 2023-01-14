<script setup>
import { reactive } from '@vue/reactivity'

const props = defineProps({
    value: { type: [Number, String] },
    options: { type: Array }
})
const data = reactive({
    isFocused: false
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
    <div class="row row--center row--middle gap-m">
        <button type="button" class="radio-select-item clickable"
            v-for="item of options"
            :key="item.id"
            :class="[item.id == value ? 'checked' : '']"
            @click="setValue(item.id)">{{ item.name }}</button>
    </div>
</template>

<style scoped>
.radio-select-item {
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--unit-s);
    padding: var(--unit-s) var(--unit-m);
    font-size: 16px;
}

.radio-select-item::after {
    content: '';
    width: var(--unit-m);
    height: var(--unit-m);
    box-sizing: border-box;
    border: 2px solid var(--color-border);
    border-radius: 100%;
    transition: border-color 120ms ease;
}

.radio-select-item.checked::after {
    border-color: var(--color-highlight-primary);
}

</style>
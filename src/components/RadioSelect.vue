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
    <div class="row row--center row--middle">
        <button type="button" class="radio-select-item clickable"
            v-for="item of options"
            :key="item.id"
            :class="[item.id == value ? 'checked' : '']"
            @click="setValue(item.id)">{{ item.name }}</button>
    </div>
</template>

<style scoped>
.radio-select-item {
    padding: var(--unit-s);
    font-size: 16px;
    color: var(--color-fg);
    border: solid 1px var(--color-border);
    text-align: center;
    flex: 1;
}

.radio-select-item:first-of-type {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.radio-select-item:last-of-type {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.radio-select-item.checked {
    color: var(--color-bg);
    border-color: var(--color-highlight-primary);
    background-color: var(--color-primary);
}

</style>
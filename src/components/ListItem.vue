<script setup>

const props = defineProps({
    icon: { type: String },
    title: { type: String },
    subtitle: { type: String },
    clickable: { type: Boolean, default: true }
})

const emit = defineEmits(['select'])

function select() {
    if (!props.clickable) {
        return
    }
    emit('select')
}

</script>

<template>
    <div class="row row--middle gap-l p-m" :class="{ 'clickable': clickable }" @click="select()">
        <i class="icon icon--l" :class="icon" v-if="icon"></i>
        <div class="column gap-s">
            <div>{{ title }}</div>
            <div class="text-secondary text-s" v-if="subtitle">{{ subtitle }}</div>
        </div>
    </div>
</template>

<style scoped>

</style>
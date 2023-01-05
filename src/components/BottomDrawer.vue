<script setup>
const props = defineProps({
    title: String
})
</script>

<template>
  <div class="bottom-drawer">
    <div class="bottom-drawer__title" v-if="title">{{ title }}</div>
    <div class="bottom-drawer__line">
        <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.bottom-drawer {
    position: fixed;
    bottom: 0px;
    background-color: var(--color-overlay);
    width: 100%;
}

.bottom-drawer__title {
    text-align: center;
    padding: var(--unit-s);
}

.bottom-drawer__line {
    position: relative;
}

.bottom-drawer__line::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0px;
    width: 20%;
    height: 1px;
    background-color: var(--color-highlight-primary);
    transform: translateX(-50%);
}
</style>
<script setup>
const props = defineProps({
    title: String
})
</script>

<template>
  <div class="bottom-drawer">
    <div class="bottom-drawer__top" v-if="title">
        <div class="bottom-drawer__title">{{ title }}</div>
    </div>
    <div class="bottom-drawer__line">
        <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.bottom-drawer {
    position: fixed;
    bottom: 0px;
    width: 100%;
    z-index: 5;
}

.bottom-drawer__top {
    display: flex;
    flex-direction: row;
    justify-content: center;
    overflow: hidden;
}

.bottom-drawer__title {
    text-align: center;
    padding: var(--unit-s) var(--unit-m);
    color: var(--color-fg-secondary);
    background-color: var(--color-bg);
    border-radius: 8px;
}

.bottom-drawer__line {
    position: relative;
    background-color: var(--color-overlay);
}

.bottom-drawer__line::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0px;
    width: 30%;
    height: 1px;
    background-color: var(--color-highlight-primary);
    transform: translateX(-50%);
}
</style>
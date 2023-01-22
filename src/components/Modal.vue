<script setup>

const emit = defineEmits(['outsideClick'])

let clickStatus = ''

function clickStart() {
  clickStatus = 'start'
}

function clickEnd() {
  if (clickStatus !== 'start') {
    return
  }
  emit('outsideClick')
}

</script>

<template>
  <div class="modal" @mousedown="clickStart()" @mouseup="clickEnd()">
    <div class="modal__card" @mousedown.stop>
        <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal {
    position: fixed;
    z-index: 20;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.modal__card {
    border-radius: 4px;
    background-color: var(--color-bg);
    width: 80%;
    max-height: 80%;
    border: 1px solid var(--color-border);
    overflow: auto;
}
</style>
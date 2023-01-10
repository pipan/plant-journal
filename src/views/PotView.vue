<script setup>
import { reactive } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import BottomDrawer from '../components/BottomDrawer.vue'

const router = useRouter()

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'home' })
    }
    router.go(-1)
}

</script>

<template>
<div>
    <div class="view">
        <h1>Pot Name</h1>
    </div>
    <bottom-drawer>
        <div class="row text-center gap-s p-s">
            <button type="button" class="bottom-drawer-button clickable" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
        </div>
    </bottom-drawer>
</div>
</template>

<style scoped>
.view  {
    min-height: 100vh;
    width: 100vw;
    background-color: var(--color-bg);
    /* outline: var(--color-border) 1px solid; */
}
h1 {
    font-size: 1.5rem;
    text-align: center;
    padding: var(--unit-m);
    margin: 0px;
    position: relative;
    font-weight: 100;
}

h1::before {
    content: '';
    position: absolute;
    width: 80%;
    height: 1px;
    left: 10%;
    bottom: 0px;
    background-color: var(--color-border);
}

.bottom-drawer-button {
    border-radius: 4px;
    padding: var(--unit-s);
    flex: 1;
}
</style>

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
        <div class="column py-m">
            <div class="devider">Jan 2023</div>
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">1.5 l</div>
                </div>
                <div class="column column--center text-idle">
                    <div>26</div>
                    <div class="text-s">10:00</div>
                </div>
            </div>
            <!-- <div class="devider">25 Jan 2023</div> -->
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">500 ml</div>
                </div>
                <div class="column column--center text-idle">
                    <div>25</div>
                    <div class="text-s">10:00</div>
                </div>
            </div>
            <!-- <div class="devider">24 Jan 2023</div> -->
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">750 ml</div>
                </div>
                <div class="column column--center text-idle">
                    <div>24</div>
                    <div class="text-s">18:50</div>
                </div>
            </div>
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">750 ml</div>
                </div>
                <div class="column column--center text-idle">
                    <div>24</div>
                    <div class="text-s">10:00</div>
                </div>
            </div>
            <div class="devider">Dec 2022</div>
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">1.5 l</div>
                </div>
                <div class="column column--center text-idle">
                    <div>31</div>
                    <div class="text-s">08:10</div>
                </div>
            </div>
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">1.5 l</div>
                </div>
                <div class="column column--center text-idle">
                    <div>31</div>
                    <div class="text-s">08:10</div>
                </div>
            </div>
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">1.5 l</div>
                </div>
                <div class="column column--center text-idle">
                    <div>31</div>
                    <div class="text-s">08:10</div>
                </div>
            </div>
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">1.5 l</div>
                </div>
                <div class="column column--center text-idle">
                    <div>31</div>
                    <div class="text-s">08:10</div>
                </div>
            </div>
            <div class="row row--middle gap-m p-m">
                <div class="event-icon">
                    <i class="icon icon-water-drop"></i>
                </div>
                <div class="column gap-s flex">
                    <div>Water</div>
                    <div class="text-secondary text-s">1.5 l</div>
                </div>
                <div class="column column--center text-idle">
                    <div>31</div>
                    <div class="text-s">08:10</div>
                </div>
            </div>
        </div>
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
    padding-bottom: 58px;
    box-sizing: border-box;
}
h1 {
    position: sticky;
    top: 0px;
    z-index: 2;
    font-size: 1.5rem;
    text-align: center;
    padding: var(--unit-m);
    margin: 0px;
    font-weight: 100;
    background-color: var(--color-overlay);
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

.event-icon {
    border: 1px solid var(--color-border);
    border-radius: 100%;
    padding: 4px;
}

.devider {
    position: relative;
    padding: var(--unit-m);
    text-align: right;
    color: var(--color-border);
}
/* .devider::before {
    content: '';
    position: absolute;
    width: 30%;
    height: 1px;
    background-color: var(--color-border);
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
} */
</style>

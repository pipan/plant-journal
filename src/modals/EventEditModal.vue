<script setup>
import { reactive } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import Modal from '../components/Modal.vue'
import { useEventRepository } from '../repository/eventRepository'

const eventRepository = useEventRepository()
const router = useRouter()
const route = useRoute()

const data = reactive({
    managementAction: ''
})

function create() {
    if (!data.managementAction) {
        return
    }
    if (data.managementAction == 'delete') {
        let intIds = []
        for (const id of route.query.ids) {
            intIds.push(parseInt(id))
        }
        eventRepository.removeList(intIds).then(() => {
            this.close()
        })
    }
}

function toggleManagementAction(value) {
    if (value == data.managementAction) {
        data.managementAction = ''
    } else {
        data.managementAction = value
    }
}

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'pot' })
    }
    router.go(-1)
}
</script>

<template>
<modal @outside-click="close()">
    <div class="p-m">
        <form class="column gap-l" @submit.prevent="create()">
            <div class="column">
                <div class="row row--middle gap-l p-m clickable" @click="toggleManagementAction('delete')">
                    <i class="icon icon-bin icon--l" :class="[data.managementAction == 'delete' ? 'text-warn' : 'text-idle']"></i>
                    <div class="column">
                        <div>Delete</div>
                        <div class="text-secondary text-s">Permanently remove events</div>
                    </div>
                </div>
            </div>
            <div class="row row--center gap-l">
                <button type="button" class="btn-circle" @click="close()">
                    <i class="icon icon--l icon-close"></i>
                </button>
                <button type="primary" class="btn-circle btn-circle--primary" :disabled="!data.managementAction">
                    <i class="icon icon--l icon-check"></i>
                </button>
            </div>
        </form>
    </div>
</modal>
</template>

<style scoped>

</style>

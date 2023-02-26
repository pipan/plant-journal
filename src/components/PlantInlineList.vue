<script setup>
import { reactive } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import { usePlantRepository } from '../repository/plant.repository'

const plantsRepository = usePlantRepository()

const props = defineProps({
    ids: { type: Array, default: () => [] }
})

const data = reactive({
    plants: {}
})

const plantsResolved = computed(() => {
    let hist = {}
    for (let id of props.ids) {
        if (!data.plants[id]) { continue }
        if (!hist[data.plants[id].variety]) {
            hist[data.plants[id].variety] = 0
        }
        hist[data.plants[id].variety]++
    }

    let result = []
    for (let key in hist) {
        result.push(hist[key] + 'x ' + key)
    }
    return result
})

onMounted(() => {
    plantsRepository.selectAll().then((plants) => {
        let map = {}
        for (let plant of plants) {
            map[plant.id] = plant
        }
        data.plants = map
    })
})
</script>

<template>
    <div class="ellipsis">{{ plantsResolved.join(", ") }}</div>
</template>

<style scoped>

</style>
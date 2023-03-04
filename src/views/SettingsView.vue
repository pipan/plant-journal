<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomDrawer from '../components/BottomDrawer.vue'
import ListItem from '../components/ListItem.vue'
import { useEventRepository } from '../repository/eventRepository'
import { usePlantRepository } from '../repository/plant.repository'
import { usePotRepository } from '../repository/pot.repository'

const router = useRouter()
const eventRepository = useEventRepository()
const plantRespository = usePlantRepository()
const potRepository = usePotRepository()

const exportDownload = ref(null)
const importInput = ref(null)

const data = reactive({
    loadingExport: true,
    loadingImport: false,
    exportUrl: '',
    exportFilename: `plant-journal-${new Date().getTime()}.json`
})

function close() {
    if (window.history.length <= 1) {
        return router.push({ name: 'home' })
    }
    router.go(-1)
}

function donwloadExport(event) {
    exportDownload.value.click(event)
}

function openImport(event) {
    importInput.value.click(event)
}

function importFile(event) {
    data.loadingImport = true
    const files = event.target.files
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        const prefix = 'data:application/json;base64,'
        if (!reader.result.startsWith(prefix)) {
            data.loadingImport = false
            return
        }
        
        const base64 = reader.result.substring(prefix.length)
        const dataString = decodeURIComponent(escape(window.atob(base64)));
        const dataJson = JSON.parse(dataString)
        
        importPots(dataJson.pots).then((potMap) => {
            return importPlants(dataJson.plants, potMap)
        }).then((plantMap) => {
            return importEvents(dataJson.events, plantMap)
        }).then(() => {
            data.loadingImport = false
        })
    });
    reader.readAsDataURL(files[0]);
}

function importPots(pots) {
    let promises = []
    for (let pot of pots) {
        let potCopy = Object.assign({}, pot)
        if (potCopy.archiveAt) {
            potCopy.archiveAt = new Date(potCopy.archiveAt)
        }
        delete potCopy.id
        promises.push(potRepository.insert(potCopy))
    }
    return Promise.all(promises).then((insertedPots) => {
        let map = {}
        for (let i = 0; i < pots.length; i++) {
            map[pots[i].id] = insertedPots[i]
        }
        return map
    })
}

function importPlants(plants, potMap) {
    let promises = []
    for (let plant of plants) {
        let plantCopy = Object.assign({}, plant)
        delete plantCopy.id
        plantCopy.potId = potMap[plantCopy.potId]
        promises.push(plantRespository.insert(plantCopy))
    }
    return Promise.all(promises).then((insertedPlants) => {
        let map = {}
        for (let i = 0; i < plants.length; i++) {
            map[plants[i].id] = insertedPlants[i]
        }
        return map
    })
}

function importEvents(events, plantMap) {
    let promises = []
    for (let event of events) {
        let eventCopy = Object.assign({}, event)
        delete eventCopy.id
        eventCopy.plantId = plantMap[eventCopy.plantId]
        eventCopy.createdAt = new Date(eventCopy.createdAt)
        promises.push(eventRepository.insert(eventCopy))
    }
    return Promise.all(promises).then((insertedEvents) => {
        let map = {}
        for (let i = 0; i < events.length; i++) {
            map[events[i].id] = insertedEvents[i]
        }
        return map
    })
}

onMounted(() => {
    data.loadingExport = true
    let promises = []
    promises.push(eventRepository.selectAll())
    promises.push(plantRespository.selectAll())
    promises.push(potRepository.selectAll())
    Promise.all(promises).then((results) => {
        let exportData = {
            events: results[0],
            plants: results[1],
            pots: results[2]
        }
        data.exportUrl = URL.createObjectURL(new Blob([JSON.stringify(exportData)], {
            type: 'application/json'
        }))
        data.loadingExport = false
    })
})
</script>

<template>
<div>
    <div class="view">
        <div class="column py-m">
            <div class="devider">Data</div>
            <list-item :icon="data.loadingImport ? 'icon-loading' : 'icon-import'" title="Import" subtitle="Add data into your application from local file" @click="openImport()"></list-item>
            <input type="file" accept=".json" class="hide" ref="importInput" @change="importFile($event)" />
            <list-item :icon="data.loadingExport ? 'icon-loading' : 'icon-export'" title="Export" subtitle="Save all your data into a local file" @click="donwloadExport($event)"></list-item>
            <a :href="data.exportUrl" :download="data.exportFilename" class="hide" ref="exportDownload"></a>
        </div>
    </div>
    <bottom-drawer title="Settings">
        <div class="row text-center gap-s p-s">
            <button type="button" class="bottom-drawer-button clickable" @click="close()">
                <i class="icon icon--l icon-close"></i>
            </button>
        </div>
    </bottom-drawer>
</div>
</template>

<style scoped>
.bottom-drawer-button {
    border-radius: 4px;
    padding: var(--unit-s);
    flex: 1;
}

.devider {
    position: relative;
    padding: var(--unit-m);
    text-align: right;
    color: var(--color-border);
}
</style>

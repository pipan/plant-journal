import { useEventRepository } from "../repository/eventRepository"
import { usePlantRepository } from "../repository/plant.repository"

export function usePlant() {
    const plantRepo = usePlantRepository()
    const eventRepo = useEventRepository()

    function create(plantData, eventData) {
        return plantRepo.insert(plantData).then((plantId) => {
            const event = Object.assign({ plantId: plantId, potId: plantData.potId }, eventData)
            return eventRepo.insert(event).then((eventId) => {
                return { plantId: plantId, eventId: eventId }
            })
        })
    }

    function createBatch(plantData, count, eventData) {
        let promises = []
        for (let i = 0; i < count; i ++) {
            promises.push(create(plantData, eventData))
        }
        return Promise.all(promises)
    }

    function createEvent(plantIds, data) {
        let promises = []
        for (let id of plantIds) {
            let insertPromise = plantRepo.select(id).then((plant) => {
                return eventRepo.insert(Object.assign({ plantId: id, potId: plant.potId }, data))
            })
            promises.push(insertPromise)
        }
        return Promise.all(promises)
    }

    function moveSingle(plantId, targetPotId, eventData) {
        let plantOutEvent = Object.assign({}, eventData, { type: 'plantOut' })
        return createEvent([plantId], plantOutEvent).then(() => {
                return plantRepo.patch(plantId, { potId: targetPotId })
            }).then(() => {
                let plantInEvent = Object.assign({}, eventData, { type: 'plantIn' })
                return createEvent([plantId], plantInEvent)
            })
    }

    function move(plantIds, targetPotId, eventData) {
        let promises = []
        for (let plantId of plantIds) {
            promises.push(moveSingle(plantId, targetPotId, eventData))
        }
        return Promise.all(promises)
    }

    function cut(plantIds, data) {
        return createEvent(plantIds, Object.assign({ type: 'cut' }, data))
    }

    function death(plantIds, data) {
        let promises = []
        for (let id of plantIds) {
            let promise = plantRepo.patch(id, { dead: true })
            promises.push(promise)
        }
        return Promise.all(promises).then(() => {
            return createEvent(plantIds, Object.assign({ type: 'death' }, data))
        })
        
    }

    function note(plantIds, data) {
        return createEvent(plantIds, Object.assign({ type: 'note' }, data))
    }

    return { create, createBatch, move, cut, death, note }
}
import { useEventRepository } from "../repository/eventRepository"
import { usePlantRepository } from "../repository/plant.repository"

export function usePlant() {
    const plantRepo = usePlantRepository()
    const eventRepo = useEventRepository()

    function create(plantData, eventData) {
        return plantRepo.insert(plantData).then((plantId) => {
            const event = Object.assign({plantId: plantId}, eventData)
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

    return { create, createBatch }
}
import { useRepository } from "./repository"

export function useEventRepository() {
    const eventRepo = useRepository('event')

    function selectByPlant(plantId) {
        return eventRepo.selectByIndex('plantId', plantId)
    }

    function selectByPlants(plantIds) {
        let promises = []
        for (let id of plantIds) {
            promises.push(selectByPlant(id))
        }
        return Promise.all(promises).then((items) => {
            let result = []
            for (let item of items) {
                result.push(...item)
            }
            return result
        })
    }

    function select(id) {
        return eventRepo.select(id)
    }

    function update(data) {
        return eventRepo.update(data)
    }

    function patch(id, data) {
        return eventRepo.patch(id, data)
    }

    function insert(data) {
        return eventRepo.insert(data)
    }

    return { update, patch, insert, select, selectByPlant, selectByPlants }
}
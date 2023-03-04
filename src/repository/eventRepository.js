import { useRepository } from "./repository"

export function useEventRepository() {
    const eventRepo = useRepository('event')

    function selectAll() {
        return eventRepo.selectAll()
    }

    function selectByPlant(plantId) {
        return eventRepo.selectByIndex('plantId', plantId)
    }

    function selectByPot(potId) {
        return eventRepo.selectByIndex('potId', potId)
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

    function selectByPlantForPot(plantId, potId) {
        return selectByPlant(plantId).then((events) => {
            let result = []
            for (let event of events) {
                if (event.potId !== potId) {
                    continue
                }
                result.push(event)
            }
            return result
        })
    }

    function selectByPlantsForPot(plantIds, potId) {
        let promises = []
        for (let id of plantIds) {
            promises.push(selectByPlantForPot(id, potId))
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

    function removeByPot(potId) {
        return selectByPot(potId).then((events) => {
            let eventIds = []
            for (let event of events) {
                eventIds.push(event.id)
            }
            return eventRepo.removeList(eventIds)
        })
    }

    function removeList(ids) {
        return eventRepo.removeList(ids)
    }

    return { update, patch, insert, select, selectAll, selectByPot, selectByPlant, selectByPlants, selectByPlantForPot, selectByPlantsForPot, removeByPot, removeList }
}
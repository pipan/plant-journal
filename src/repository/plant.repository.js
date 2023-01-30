import { useRepository } from "./repository"

export function usePlantRepository() {
    const plantRepo = useRepository('plant')

    function selectAllByPot(potId) {
        return plantRepo.selectByIndex('potId', potId)
    }

    function selectActiveByPot(potId) {
        return selectAllByPot(potId).then((plants) => {
            let result = []
            for (let plant of plants) {
                if (plant.dead) {
                    continue
                }
                result.push(plant)
            }
            return result
        })
    }

    function selectAll() {
        return plantRepo.selectAll()
    }

    function selectAllActive() {
        return selectAll().then((plants) => {
            let result = []
            for (let plant of plants) {
                if (plant.dead) {
                    continue
                }
                result.push(plant)
            }
            return result
        })
    }

    function select(id) {
        return plantRepo.select(id)
    }

    function update(data) {
        return plantRepo.update(data)
    }

    function patch(id, data) {
        return plantRepo.patch(id, data)
    }

    function insert(data) {
        return plantRepo.insert(data)
    }

    function removeByPot(potId) {
        return selectAllByPot(potId).then((plants) => {
            let ids = []
            for (let plant of plants) {
                ids.push(plant.id)
            }
            plantRepo.removeList(ids)
        })
    }

    return { update, patch, insert, select, selectAllByPot, selectActiveByPot, selectAllActive, selectAll, removeByPot }
}
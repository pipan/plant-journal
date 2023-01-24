import { useRepository } from "./repository"

export function usePlantRepository() {
    const plantRepo = useRepository('plant')

    function selectByPot(potId) {
        return plantRepo.selectByIndex('potId', potId)
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

    return { update, patch, insert, select, selectByPot }
}
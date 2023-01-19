import { useRepository } from "./repository"

export function usePotRepository() {
    const potRepo = useRepository('pot')

    function select(id) {
        return potRepo.select(id)
    }

    function update(data) {
        return potRepo.update(data)
    }

    function patch(id, data) {
        return potRepo.patch(id, data)
    }

    function insert(data) {
        return potRepo.insert(data)
    }

    return { update, patch, insert, select }
}
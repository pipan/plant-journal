import { useRepository } from "./repository"

export function usePotRepository() {
    const potRepo = useRepository('pot')

    function select(id) {
        return potRepo.select(id)
    }

    function selectAll() {
        return potRepo.selectAll()
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

    function remove(id) {
        return potRepo.remove(id)
    }

    return { update, patch, insert, select, selectAll, remove }
}
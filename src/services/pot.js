import { useEventRepository } from "../repository/eventRepository"
import { usePlantRepository } from "../repository/plant.repository"

export function usePot() {
    const plantRepo = usePlantRepository()
    const eventRepo = useEventRepository()

    function water(potId, data) {
        return plantRepo.selectByPot(potId).then((plants) => {
            let promises = []
            for (let plant of plants) {
                const promise = eventRepo.insert(Object.assign({}, data, { plantId: plant.id, type: 'water' }))
                promises.push(promise)
            }
            return Promise.all(promises)
        })
    }

    return { water }
}
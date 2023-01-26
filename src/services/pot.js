import { useEventRepository } from "../repository/eventRepository"
import { usePlantRepository } from "../repository/plant.repository"

export function usePot() {
    const plantRepo = usePlantRepository()
    const eventRepo = useEventRepository()

    function createEvent(potId, data) {
        return plantRepo.selectByPot(potId).then((plants) => {
            let promises = []
            for (let plant of plants) {
                const promise = eventRepo.insert(Object.assign({ plantId: plant.id }, data))
                promises.push(promise)
            }
            return Promise.all(promises)
        })
    }

    function water(potId, data) {
        return createEvent(potId, Object.assign({ type: 'water' }, data))
    }

    function fertilize(potId, data) {
        return createEvent(potId, Object.assign({ type: 'fertilize' }, data))
    }

    return { water, fertilize }
}
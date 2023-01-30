import { useEventRepository } from "../repository/eventRepository"
import { usePlantRepository } from "../repository/plant.repository"
import { usePotRepository } from '../repository/pot.repository'

export function usePot() {
    const potRepo = usePotRepository()
    const plantRepo = usePlantRepository()
    const eventRepo = useEventRepository()

    function createEvent(potId, data) {
        return plantRepo.selectActiveByPot(potId).then((plants) => {
            let promises = []
            for (let plant of plants) {
                const promise = eventRepo.insert(Object.assign({ plantId: plant.id, potId: potId }, data))
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

    function archive(potId) {
        return potRepo.select(potId).then((pot) => {
            return potRepo.patch(potId, { canvasId: 'archive', archiveAt: new Date(), lastCanvasId: pot.canvasId })
        })
    }

    function recover(potId) {
        return potRepo.select(potId).then((pot) => {
            return potRepo.patch(potId, { canvasId: pot.lastCanvasId, archiveAt: null, lastCanvasId: null })
        })
    }

    function remove(potId) {
        return Promise.all([
            eventRepo.removeByPot(potId),
            plantRepo.removeByPot(potId),
            potRepo.remove(potId)
        ])
    }

    return { archive, recover, remove, water, fertilize }
}
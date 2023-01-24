import { usePlantRepository } from "../repository/plant.repository"

export function usePlant() {
    const plantRepo = usePlantRepository()

    function create(plantData) {
        return plantRepo.insert(plantData).then((plant) => {
            // todo: insert event
            return plant
        })
    }

    function createBatch(plant, count) {
        let promises = []
        for (let i = 0; i < count; i ++) {
            promises.push(create(plant))
        }
        return Promise.all(promises)
    }

    return { create, createBatch }
}
import { hasMany } from "../services/database";
import { useRepository } from "./repository";

export function useCanvasRepository() {
    const canvasRepo = useRepository('canvas')
    const potRepo = useRepository('pot')

    function selectAll() {
        return canvasRepo.selectAll().then((canvas) => {
            return hasMany(canvas, 'pots', (item) => { return potRepo.selectByIndex('canvasId', item.id) })
        })
    }
    
    function select(id) {
        return canvasRepo.select(id).then((canvas) => {
            return hasMany(canvas, 'pots', (item) => { return potRepo.selectByIndex('canvasId', item.id) })
        })
    }

    function update(data) {
        return canvasRepo.update(data)
    }

    function patch(id, data) {
        return canvasRepo.patch(id, data)
    }

    function insert(data) {
        return canvasRepo.insert(id, data)
    }

    return { selectAll, select, update, patch, insert }
}
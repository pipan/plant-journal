import { usePotRepository } from "../repository/pot.repository"

export function hslCss(hue) {
    return `hsl(${hue}deg, 65%, 50%)`
}

export function getHueList() {
    const potRepo = usePotRepository()
    return potRepo.selectAll().then((pots) => {
        let result = [0, 30, 210, 270]
        let map = {0: true, 30: true, 210: true, 270: true}
        for (const pot of pots) {
            if (pot.hue === undefined || map[pot.hue]) {
                continue
            }
            result.push(pot.hue)
            map[pot.hue] = true
        }
        return result
    })
}
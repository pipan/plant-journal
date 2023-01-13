import { normMap, stepRound } from './units'

export function useScale(normBreakpoints, mapBreakpoints) {
    function norm(value) {
        let result = 0
        for (let i = 1; i < normBreakpoints.length; i++) {
            result += normMap(value, mapBreakpoints[i - 1], mapBreakpoints[i]) * (normBreakpoints[i] - normBreakpoints[i - 1])
        }
        return result
    }

    function map(value) {
        let result = 0
        for (let i = 1; i < mapBreakpoints.length; i++) {
            result += normMap(value, normBreakpoints[i - 1], normBreakpoints[i]) * (mapBreakpoints[i] - mapBreakpoints[i - 1])
        }
        return result
    }

    function mapRound(value, roundBreakpoints) {
        let result = 0
        for (let i = 1; i < normBreakpoints.length; i++) {
            result += stepRound(normMap(value, normBreakpoints[i - 1], normBreakpoints[i]) * (mapBreakpoints[i] - mapBreakpoints[i - 1]), roundBreakpoints[i - 1])
        }
        return result
    }

    return { norm, map, mapRound }
}
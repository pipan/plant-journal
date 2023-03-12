export function normMap(value, start, end) {
    const result = (value - start) / (end - start)
    return Math.max(0.0, Math.min(1.0, result))
}

export function stepRound(value, step) {
    return Math.round(value / step) * step
}
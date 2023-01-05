export function norm(value, start, end) {
    const result = (value - start) / (end - start)
    return Math.max(0.0, Math.min(1.0, result))
}

export function stepRound(value, step) {
    return Math.round(value / step) * step
}

export function volumeNorm(value) {
    return (norm(value, 0, 1000) * 0.35) + (norm(value, 1000, 3000) * 0.35) + (norm(value, 3000, 10000) * 0.3)
}

export function volumeMap(value) {
    return stepRound(norm(value, 0.0, 0.35) * 1000, 50) + stepRound(norm(value, 0.35, 0.7) * 2000, 100) + stepRound(norm(value, 0.7, 1.0) * 7000, 250)
}
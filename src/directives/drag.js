const listenerMap = {}

function createDragService(el, fn) {
    let config = null
    
    function checkMove() {
        if (!config) {
            return;
        }
        const diff = { x: config.current.x - config.start.x, y: config.current.y - config.start.y }
        if (diff.x !== 0 || diff.y !== 0) {
            config.start = config.current
            fn({ deltaX: diff.x, deltaY: diff.y, x: config.current.x, y: config.current.y })
        }
    }
    
    function touch(event) {
        event.stopPropagation()
        const x = event.touches[0].clientX
        const y = event.touches[0].clientY
        config = {
            start: { x: x, y: y },
            current: { x: x, y: y },
            interval: null,
        }
        document.addEventListener('touchmove', move)
        document.addEventListener('touchend', stop)
        if (config.interval) {
            clearInterval(config.interval)
        }
        config.interval = setInterval(checkMove, 10)
    }

    function mouse(event) {
        if (event.button !== 0) {
            return
        }
        event.stopPropagation()
        const x = event.clientX
        const y = event.clientY
        config = {
            start: { x: x, y: y },
            current: { x: x, y: y },
            interval: null,
        }
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', stop)
        if (config.interval) {
            clearInterval(config.interval)
        }
        config.interval = setInterval(checkMove, 10)
    }
    
    function stop() {
        if (config.interval) {
            clearInterval(config.interval)
            config.interval = null
            checkMove()
        }
        document.removeEventListener('mousemove', move)
        document.removeEventListener('touchmove', move)
        document.removeEventListener('mouseup', stop)
        document.removeEventListener('touchend', stop)
        el.classList.remove('drag--active')
    }

    function move(event) {
        if (!config) {
            return;
        }
        if (!el.classList.contains('drag--active')) {
            el.classList.add('drag--active')
        }
        
        const x = event.clientX !== undefined ? event.clientX : event.touches[0].clientX
        const y = event.clientY !== undefined ? event.clientY : event.touches[0].clientY
        config.current = { x: x, y: y }
    }

    return { touch, mouse }
}



export const dragDirective = {
    mounted(el, binding, vnode, prevVnode) {
        const hash = Math.random().toString().substring(2)
        el.dataset.dragHash = hash

        listenerMap[hash] = createDragService(el, binding.value)
        el.addEventListener('touchstart', listenerMap[hash].touch)
        el.addEventListener('mousedown', listenerMap[hash].mouse)
    },
    unmounted(el, binding, vnode, prevVnode) {
        const hash = el.dataset.dragHash
        el.removeEventListener('touchstart', listenerMap[hash].touch)
        el.removeEventListener('mousedown', listenerMap[hash].mouse)
        delete listenerMap[hash]
    }
}
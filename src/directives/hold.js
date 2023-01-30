const listenerMap = {}

function createHoldService(el) {
    function end() {
        el.classList.remove('hold--active')
        el.removeEventListener('mouseup', end)
        el.removeEventListener('mousemove', end)
        el.removeEventListener('touchend', end)
        el.removeEventListener('touchmove', end)
    }

    function contextmenu(event) {
        end()
    }

    function mouse(event) {
        if (event.button !== 0) {
            return
        }
        el.classList.add('hold--active')
        el.addEventListener('mouseup', end)
        el.addEventListener('mousemove', end)
    }

    function touch() {
        el.classList.add('hold--active')
        el.addEventListener('touchend', end)
        el.addEventListener('touchmove', end)
    }

    return { mouse, touch, contextmenu }
}

export const holdDirective = {
    mounted(el, binding, vnode, prevVnode) {
        if (binding.value === false) {
            return
        }
        const hash = Math.random().toString().substring(2)
        el.dataset.holdHash = hash

        listenerMap[hash] = createHoldService(el)
        el.addEventListener('mousedown', listenerMap[hash].mouse)
        el.addEventListener('touchstart', listenerMap[hash].touch)
        el.addEventListener('contextmenu', listenerMap[hash].contextmenu)
        el.classList.add('holdable')
    },
    unmounted(el, binding, vnode, prevVnode) {
        if (binding.value === false) {
            return
        }
        const hash = el.dataset.holdHash
        el.removeEventListener('mousedown', listenerMap[hash].mouse)
        el.removeEventListener('touchstart', listenerMap[hash].touch)
        el.removeEventListener('contextmenu', listenerMap[hash].contextmenu)
        el.classList.remove('holdable')
        delete listenerMap[hash]
    }
}
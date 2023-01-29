import { connect, getRequest, request } from "../services/database";

export function useRepository(name) {
    function selectAll() {
        return connect('plant').then((dbRef) => {
            const transaction = dbRef.transaction([name], "readwrite")
            const requestCursor = transaction.objectStore(name).openCursor()
            return request(requestCursor)
        })
    }
    
    function select(id) {
        return connect('plant').then((dbRef) => {
            const transaction = dbRef.transaction([name], "readwrite")
            const requestCursor = transaction.objectStore(name).get(id)
            return getRequest(requestCursor)
        })
    }

    function selectByIndex(index, value) {
        const range = IDBKeyRange.only(value)
        return selectByIndexRange(index, range)
    }

    function selectByIndexRange(index, range) {
        return connect('plant').then((dbRef) => {
            const transaction = dbRef.transaction([name], "readwrite")
            const requestCursor = transaction.objectStore(name).index(index).openCursor(range)
            return request(requestCursor)
        })
    }

    function update(data) {
        return connect('plant').then((dbRef) => {
            const transaction = dbRef.transaction([name], "readwrite")
            const requestCursor = transaction.objectStore(name).put(data)
            return getRequest(requestCursor)
        })
    }

    function patch(id, data) {
        return select(id).then((item) => {
            const payload = Object.assign({}, item, data)
            return update(payload)
        })
    }

    function insert(data) {
        return connect('plant').then((dbRef) => {
            const transaction = dbRef.transaction([name], "readwrite")
            const requestCursor = transaction.objectStore(name).add(data)
            return getRequest(requestCursor)
        })
    }

    function remove(id) {
        return connect('plant').then((dbRef) => {
            const transaction = dbRef.transaction([name], "readwrite")
            const requestCursor = transaction.objectStore(name).delete(id)
            return getRequest(requestCursor)
        })
    }

    function removeList(ids) {
        let promises = []
        for  (let id of ids) {
            promises.push(remove(id))
        }
        return Promise.all(promises)
    }

    return { selectAll, select, selectByIndex, selectByIndexRange, update, patch, insert, remove, removeList }
}
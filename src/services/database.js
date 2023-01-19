import { initMigration } from "../migration/init.migration";

let connections = {
    plant: {
        migrations: [
            initMigration
        ]
    }
};

export function connect(dbName) {
    return new Promise((resolve, reject) => {
        if (!connections[dbName]) {
            return reject('DB does not exists: ' + dbName)
        }
        if (connections[dbName].ref) {
            return resolve(connections[dbName].ref)
        }

        const DBOpenRequest = window.indexedDB.open(dbName, connections[dbName].migrations.length)
        DBOpenRequest.onsuccess = (event) => {
            connections[dbName].ref = event.target.result;
            resolve(connections[dbName].ref)
        }

        DBOpenRequest.onerror = (event) => {
            console.error("DB error", event)
            reject('DB error', event)
        }

        DBOpenRequest.onupgradeneeded = (event) => {
            for (let i = event.oldVersion; i < event.newVersion; i++) {
                connections[dbName].migrations[i](event.target.result)
            }
        }
    })
}

export function request(dbRequest) {
    return new Promise((resolve, reject) => {
        let result = []
        dbRequest.onerror = (err) => {
            reject(err)
        }
        dbRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                result.push(cursor.value)
                cursor.continue()
            } else {
                resolve(result)
            }
        }
    })
}

export function getRequest(dbRequest) {
    return new Promise((resolve, reject) => {
        dbRequest.onerror = (err) => {
            reject(err)
        }
        dbRequest.onsuccess = (event) => {
            resolve(event.target.result)
        }
    })
}

export function hasMany(items, property, fn) {
    const isArray = items.length !== undefined
    if (!isArray) {
        items = [items]
    }
    let promises = []
    for (let item of items) {
        const selectPromise = fn(item)
        promises.push(selectPromise)
    }
    return Promise.all(promises).then((result) => {
        for (let i = 0; i < items.length; i++) {
            items[i][property] = result[i]
        }
        return isArray ? items : items[0] 
    })
}
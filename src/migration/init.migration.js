import { seed } from '../services/database'

export function initMigration(dbRef) {
    const canvasStore = dbRef.createObjectStore("canvas", { keyPath: 'id' });
    canvasStore.createIndex("id", "id", { unique: true });
    let promise = seed(canvasStore, [
        { id: 0, name: 'top left'},
        { id: 1, name: 'top'},
        { id: 2, name: 'top right'},
        { id: 3, name: 'left'},
        { id: 4, name: 'center'},
        { id: 5, name: 'right'},
        { id: 6, name: 'bottom left'},
        { id: 7, name: 'bottom'},
        { id: 8, name: 'bottom right'},
        { id: 'archive', name: 'Archive'}
    ])

    const potStore = dbRef.createObjectStore("pot", { autoIncrement: true, keyPath: 'id' });
    potStore.createIndex("id", "id", { unique: true });
    potStore.createIndex("canvasId", "canvasId", { unique: false });

    const plantStore = dbRef.createObjectStore("plant", { autoIncrement: true, keyPath: 'id' });
    plantStore.createIndex("id", "id", { unique: true });
    plantStore.createIndex("potId", "potId", { unique: false });

    const eventStore = dbRef.createObjectStore("event", { autoIncrement: true, keyPath: 'id' });
    eventStore.createIndex("id", "id", { unique: true });
    eventStore.createIndex("plantId", "plantId", { unique: false });
    eventStore.createIndex("potId", "potId", { unique: false });

    return promise
}
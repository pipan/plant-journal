export function initMigration(dbRef) {
    const canvasStore = dbRef.createObjectStore("canvas", { keyPath: 'id' });
    canvasStore.createIndex("id", "id", { unique: true });
    canvasStore.put({ id: 0, name: 'top left'})
    canvasStore.put({ id: 1, name: 'top'})
    canvasStore.put({ id: 2, name: 'topright'})
    canvasStore.put({ id: 3, name: 'left'})
    canvasStore.put({ id: 4, name: 'center'})
    canvasStore.put({ id: 5, name: 'right'})
    canvasStore.put({ id: 6, name: 'bottom left'})
    canvasStore.put({ id: 7, name: 'bottom'})
    canvasStore.put({ id: 8, name: 'bottom right'})

    const potStore = dbRef.createObjectStore("pot", { autoIncrement: true, keyPath: 'id' });
    potStore.createIndex("id", "id", { unique: true });
    potStore.createIndex("canvasId", "canvasId", { unique: false });
    potStore.put({ canvasId: 0, name: 'TEST', x: 0.5, y: 0.5, color: 'red', shape: 'circle', volume: 4000 })
    potStore.put({ canvasId: 0, name: 'TEST B', x: 0.2, y: 0.2, color: 'orange', shape: 'circle', volume: 4000 })
    potStore.put({ canvasId: 1, name: 'ABC', x: 0.5, y: 0.5, color: 'red', shape: 'square', volume: 4000 })
}
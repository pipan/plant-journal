export function initMigration(dbRef) {
    const canvasStore = dbRef.createObjectStore("canvas", { keyPath: 'id' });
    canvasStore.createIndex("id", "id", { unique: true });
    canvasStore.put({ id: 0, name: 'top left'})
    canvasStore.put({ id: 1, name: 'top'})
    canvasStore.put({ id: 2, name: 'top right'})
    canvasStore.put({ id: 3, name: 'left'})
    canvasStore.put({ id: 4, name: 'center'})
    canvasStore.put({ id: 5, name: 'right'})
    canvasStore.put({ id: 6, name: 'bottom left'})
    canvasStore.put({ id: 7, name: 'bottom'})
    canvasStore.put({ id: 8, name: 'bottom right'})

    const potStore = dbRef.createObjectStore("pot", { autoIncrement: true, keyPath: 'id' });
    potStore.createIndex("id", "id", { unique: true });
    potStore.createIndex("canvasId", "canvasId", { unique: false });

    const plantStore = dbRef.createObjectStore("plant", { autoIncrement: true, keyPath: 'id' });
    plantStore.createIndex("id", "id", { unique: true });
    plantStore.createIndex("potId", "potId", { unique: false });

    const eventStore = dbRef.createObjectStore("event", { autoIncrement: true, keyPath: 'id' });
    eventStore.createIndex("id", "id", { unique: true });
    eventStore.createIndex("plantId", "plantId", { unique: false });
}
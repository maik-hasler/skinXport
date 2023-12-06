const dbName = 'SkinportSalesDB';
const objectStoreName = 'MarketSalesStatsStore';

export function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        // Use 'skinName' as the key path for the object store
        const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'skinName' });
      };

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };

      request.onerror = function (event) {
        reject('Error opening database');
      };
    });
}

export function addData(db, data) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([objectStoreName], 'readwrite');
      const objectStore = transaction.objectStore(objectStoreName);

      // Iterate over each entry in the data object
      for (const key in data) {
        const stats = data[key];

        // Use the key as the skin name and stats as the value
        const request = objectStore.put({ skinName: key, stats });

        request.onerror = function (event) {
          reject('Error adding data');
        };
      }

      transaction.oncomplete = function () {
        resolve('Data added successfully');
      };
    });
}

export function getData(db, skinName) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([objectStoreName], 'readonly');
      const objectStore = transaction.objectStore(objectStoreName);

      const request = objectStore.get(skinName);

      request.onsuccess = function (event) {
        const result = event.target.result;
        if (result) {
          resolve(result);
        } else {
          reject('Data not found');
        }
      };

      request.onerror = function (event) {
        reject('Error getting data');
      };
    });
}
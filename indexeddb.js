// IndexedDB module (indexeddb.js)
const dbName = 'MarketDataDB';
const objectStoreName = 'MarketDataStore';

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'marketHashName' });
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      reject('Error opening database');
    };
  });
}

export function addData(db, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.put(data);

    transaction.oncomplete = function() {
      resolve('Data added successfully');
    };

    request.onerror = function(event) {
      reject('Error adding data');
    };
  });
}

export function getData(db, marketHashName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.get(marketHashName);

    request.onsuccess = function(event) {
      const result = event.target.result;
      if (result) {
        resolve(result);
      } else {
        reject('Data not found');
      }
    };

    request.onerror = function(event) {
      reject('Error getting data');
    };
  });
}

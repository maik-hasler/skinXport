import { openDatabase, addData } from './database.js';

chrome.alarms.create('fetchDataAlarm', {
  periodInMinutes: 1,
  when: Date.now()
});

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === 'fetchDataAlarm') {
    try {
      const response = await fetch("https://api.skinport.com/v1/sales/history");
      const data = await response.json();

      const transformedData = {};

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const marketHashName = item["market_hash_name"];
        transformedData[marketHashName] = {
          last_7_days: item["last_7_days"]
        };
      }

      const db = await openDatabase();

      await addData(db, transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});
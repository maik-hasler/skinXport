async function checkAlarmState() {
  const alarm = await chrome.alarms.get('fetchDataAlarm');
  if (!alarm) {
    await chrome.alarms.create('fetchDataAlarm', { periodInMinutes: 5 });
  }
}

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

      // Save the data to the database

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});



checkAlarmState();
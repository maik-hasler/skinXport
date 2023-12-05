const fetchData = async () => {
  try {
    const response = await fetch("https://api.skinport.com/v1/sales/history?app_id=730&currency=EUR");
    const data = await response.json();

    const transformedData = {};

    data.forEach(item => {
      const marketHashName = item["market_hash_name"];

      transformedData[marketHashName] = {
        last_7_days: item["last_7_days"],
        last_30_days: item["last_30_days"],
        last_90_days: item["last_90_days"],
      };
    });

    console.log(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchData();

chrome.runtime.sendMessage({ type: 'fetchData' }, response => {
  console.log(response);
});

// -----------------------------------------------------------
const observer = new MutationObserver(appendQuickSummaries); 
observer.observe(document.body, {subtree: true, childList: true});

const customTag = `tag-${Date.now()}`;

function appendQuickSummaries() {
  const sales = document.getElementsByClassName('CatalogPage-item');
  for (let n = 0; n < sales.length; n++) {
    const sale = sales[n];
    if (!sale.hasAttribute(customTag)) { 
      const marketHashName = sale.querySelector('.ItemPreview-itemImage > img').getAttribute('alt');
      // fetch data here
      // pass data to addQuickSummaryForSale
      var recentSaleStatistics = undefined;
      addQuickSummaryForSale(sale, recentSaleStatistics);
      sale.setAttribute(customTag, true);
    }
  }
}

function addQuickSummaryForSale(sale, recentSaleStatistics) {
  const quickSummaryContainer = document.createElement('div');
  const horizontalLine = document.createElement('hr');
  horizontalLine.className = 'skinXport-hr';
  const title = document.createElement('span');
  title.innerText = 'Quick summary:';
  title.className = 'skinXport-heading';
  const lastSevenDays = createStatistics(4, 5.67, 4.5, 69);
  quickSummaryContainer.append(horizontalLine);
  quickSummaryContainer.append(title);
  quickSummaryContainer.append(lastSevenDays);
  const target = sale.querySelector('.ItemPreview-link')
  target.append(quickSummaryContainer);
}

function createColoredCircle(color) {
  // Validate the color
  if (color !== 'red' && color !== 'green' && color !== 'orange') {
    console.error('Invalid color. Please use "red", "green", or "orange".');
    return;
  }

  // Create a new div element
  var circle = document.createElement('div');

  // Apply the class name for styling
  circle.className = 'quick-flip-evaluation';

  // Set the background color
  circle.style.backgroundColor = color;

  return circle;
}

function createStatistics(recentSaleStatistics) {
  const lastXDaysContainer = document.createElement('div');

  // Title:
  const lastXDaysTitle = document.createElement('div');
  lastXDaysTitle.innerText = `Last 7 days:`;
  lastXDaysTitle.className = 'skinXport-minor-heading';

  // Min:
  const minContainer = document.createElement('div');
  minContainer.innerText = `Minimum: ${recentSaleStatistics['last_7_days']['min']}`;
  minContainer.className = 'skinXport-text';

  // Max:
  const maxContainer = document.createElement('div');
  maxContainer.innerText = `Maximum: ${recentSaleStatistics['last_7_days']['max']}`;
  maxContainer.className = 'skinXport-text';

  // Avg:
  const avgContainer = document.createElement('div');
  avgContainer.innerText = `Average: ${recentSaleStatistics['last_7_days']['avg']}`;
  avgContainer.className = 'skinXport-text';

  // Vol:
  const volContainer = document.createElement('div');
  volContainer.innerText = `Volume: ${recentSaleStatistics['last_7_days']['vol']}`;
  volContainer.className = 'skinXport-text';

  lastXDaysContainer.append(lastXDaysTitle);
  lastXDaysContainer.append(minContainer);
  lastXDaysContainer.append(maxContainer);
  lastXDaysContainer.append(avgContainer);
  lastXDaysContainer.append(volContainer);

  return lastXDaysContainer;
}

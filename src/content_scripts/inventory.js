const customTag = `tag-${Date.now()}`;

function appendQuickSummaries() {
    const sales = document.getElementsByClassName('InventoryPage-item');
    for (let n = 0; n < sales.length; n++) {
        const sale = sales[n];
        if (!sale.hasAttribute(customTag)) {
            const marketHashName = sale.querySelector('.ItemPreview-itemImage > img').getAttribute('alt');

            var recentSaleStatistics = assets[marketHashName];
            if (recentSaleStatistics) {
                console.log('recentSaleStatistics:', recentSaleStatistics);
                addQuickSummaryForSale(sale, recentSaleStatistics['last_7_days']);
                sale.setAttribute(customTag, true);
            } else {
                console.log(`No data for ${marketHashName}`);
            }
        }
    }
}

function addQuickSummaryForSale(sale, recentSaleStatistics) {
    console.log('recentSaleStatistics in addQuickSummaryForSale:', recentSaleStatistics);
    var price = getPriceForElement(sale);
    const quickSummaryContainer = document.createElement('div');
    const horizontalLine = document.createElement('hr');
    horizontalLine.className = 'skinXport-hr';
    const title = document.createElement('span');
    title.innerText = 'Quick summary:';
    title.className = 'skinXport-heading';
    const lastSevenDays = createStatistics(recentSaleStatistics, price);
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

    function createStatistics(recentSaleStatistics, price) {
        const lastXDaysContainer = document.createElement('div');

        // Avg:
        const avgContainer = document.createElement('div');
        avgContainer.innerText = `Average: ${recentSaleStatistics['avg']}`;
        avgContainer.className = 'skinXport-text';

        // Vol:
        const volContainer = document.createElement('div');
        volContainer.innerText = `Volume: ${recentSaleStatistics['volume']}`;
        volContainer.className = 'skinXport-text';

        const medianContainer = document.createElement('div');
        medianContainer.innerText = `Median: ${recentSaleStatistics['median']}`;
        medianContainer.className = 'skinXport-text';

        lastXDaysContainer.append(avgContainer);
        lastXDaysContainer.append(medianContainer);
        lastXDaysContainer.append(volContainer);

        return lastXDaysContainer;
    }

let assets = {};

const startupObserver = new MutationObserver((mutationsList, startupObserver) => {
    for (let mutation of mutationsList) {
        if (mutation.addedNodes.length) {
            fetchSalesHistory();
            const observer = new MutationObserver(appendQuickSummaries);
            observer.observe(document.body, { subtree: true, childList: true });
            startupObserver.disconnect();
            break;
        }
    }
});

function fetchSalesHistory() {
    chrome.runtime.sendMessage({ contentScriptQuery: 'querySalesHistory' }, (fetchedAssets) => {
        fetchedAssets.forEach(asset => {
            assets[asset.market_hash_name] = {
                last_24_hours: asset['last_24_hours'],
                last_7_days: asset['last_7_days'],
                last_30_days: asset['last_30_days'],
                last_90_days: asset['last_90_days']
            };
        });
        console.log('Fetched amount of assets:', fetchedAssets.length);
    });
}

function getPriceForElement(element) {
    const querySelector = 'div.ItemPreview-priceValue > div';
    var priceAsString = element.querySelector(querySelector).innerText;
    var priceWithoutEuroSymbol = priceAsString.replace('€', '');
    var priceWithoutEuroSymbolAndComma = priceWithoutEuroSymbol.replace(',', '');
    return parseFloat(priceWithoutEuroSymbolAndComma);
}

startupObserver.observe(document, { childList: true, subtree: true });
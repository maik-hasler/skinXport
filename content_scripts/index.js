let assets = {};

function initialize() {
    const fetchApiButton = document.createElement('button');
    fetchApiButton.textContent = 'Fetch Assets';
    fetchApiButton.onclick = function () {
        chrome.runtime.sendMessage(
            { contentScriptQuery: "querySalesHistory" },
            (fetchedAssets) => {
                console.log(`Fetched ${fetchedAssets.length} assets from Skinport.`);
                for (let n = 0; n < fetchedAssets.length; n++) {
                    assets[fetchedAssets[n].market_hash_name] = createAssetObject(fetchedAssets[n]);
                }
                console.log('Assets saved to variable.');
                console.log(assets);
            });
    };
    var marketHeader = document.querySelector('.CatalogPage-header');
    marketHeader.appendChild(fetchApiButton);

    const startObserver = document.createElement('button');
    startObserver.textContent = 'Start Observer';
    startObserver.onclick = function () {
        const observer = new MutationObserver(appendQuickSummaries);
        observer.observe(document.body, {subtree: true, childList: true});
    };
    marketHeader.appendChild(startObserver);
}

function createAssetObject(asset) {
    return {
        last_24_hours: asset['last_24_hours'],
        last_7_days: asset['last_7_days'],
        last_30_days: asset['last_30_days'],
        last_90_days: asset['last_90_days']
    };
}

const customTag = `tag-${Date.now()}`;

function appendQuickSummaries() {
    const sales = document.getElementsByClassName('CatalogPage-item');
    for (let n = 0; n < sales.length; n++) {
        const sale = sales[n];
        if (!sale.hasAttribute(customTag)) {
            const marketHashName = sale.querySelector('a.ItemPreview-href').getAttribute('aria-label');

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

        const breaker = document.createElement('br');
        lastXDaysContainer.append(breaker);

        const estimatedProfit = (recentSaleStatistics['avg'] - recentSaleStatistics['avg'] * 0.12 - price).toFixed(2);
        const estimatedProfitContainer = document.createElement('div');
        estimatedProfitContainer.innerText = `est. Profit in €: ${estimatedProfit}`;
        estimatedProfitContainer.className = 'skinXport-text';

        const estimatedProfitPercentage = (estimatedProfit / price * 100).toFixed(2);
        const estimatedProfitPercentageContainer = document.createElement('div');
        estimatedProfitPercentageContainer.innerText = `est. Profit in %: ${estimatedProfitPercentage}%`;
        estimatedProfitPercentageContainer.className = 'skinXport-text';

        if (estimatedProfitPercentage > 3){
    estimatedProfitContainer.style.color = 'green';
    estimatedProfitPercentageContainer.style.color = 'green';
        }

        lastXDaysContainer.append(estimatedProfitContainer);
        lastXDaysContainer.append(estimatedProfitPercentageContainer);
        lastXDaysContainer.append(breaker);

        const estimatedProfitMedian = (recentSaleStatistics['median'] - recentSaleStatistics['median'] * 0.12 - price).toFixed(2);
        const estimatedProfitMedianContainer = document.createElement('div');
        estimatedProfitMedianContainer.innerText = `est. Profit in €: ${estimatedProfitMedian}`;
        estimatedProfitMedianContainer.className = 'skinXport-text';

        const estimatedProfitMedianPercentage = (estimatedProfitMedian / price * 100).toFixed(2);
        const estimatedProfitPercentageMEdianContainer = document.createElement('div');
        estimatedProfitPercentageMEdianContainer.innerText = `est. Profit in %: ${estimatedProfitMedianPercentage}%`;
        estimatedProfitPercentageMEdianContainer.className = 'skinXport-text';

        if (estimatedProfitMedianPercentage > 3){
            estimatedProfitMedianContainer.style.color = 'green';
    estimatedProfitPercentageMEdianContainer.style.color = 'green';
        }

        lastXDaysContainer.append(estimatedProfitMedianContainer);
        lastXDaysContainer.append(estimatedProfitPercentageMEdianContainer);


        return lastXDaysContainer;
    }

    function getPriceForElement(element) {
        var priceAsString = element.querySelector('div.ItemPreview-priceValue > div').innerText;
        var price = parseFloat(priceAsString.replace(/[^\d.,]/g, '').replace(',', '.'));
        // var sellingPrice = price / (1 - 0.12 - profitPercentage);
        // sellingPrice = sellingPrice.toFixed(2); // Round to 2 decimal places
        return price;
}

initialize();
function addConfigurationSection(marketHeader) {
    const configurationSection = document.createElement('div');
    const configurationSectionTitle = document.createElement('h3');
    configurationSectionTitle.innerText = 'Configuration';
    configurationSectionTitle.className = 'skinXport-heading';
    configurationSection.append(configurationSectionTitle);
    configurationSection.className = 'skinXport-configuration-section';
    marketHeader.prepend(configurationSection);
}

const configStartupObserver = new MutationObserver((mutationsList, configStartupObserver) => {
    for (let mutation of mutationsList) {
        if (mutation.addedNodes.length) {
            const marketHeader = document.querySelector('.CatalogPage-content');
            if (marketHeader) {
                fetchSalesHistory();
                addConfigurationSection(marketHeader);
                const observer = new MutationObserver(appendQuickSummaries);
                observer.observe(document.body, { subtree: true, childList: true });
                configStartupObserver.disconnect();
                break;
            }
        }
    }
});

configStartupObserver.observe(document, { childList: true, subtree: true });
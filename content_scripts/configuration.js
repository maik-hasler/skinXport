function addConfigurationSection(marketHeader) {
    const configurationSection = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'skinXport-configuration-header';
    const configurationSectionTitle = document.createElement('h2');
    configurationSectionTitle.innerText = 'Configuration';
    header.append(configurationSectionTitle);

    configurationSection.append(header);
    configurationSection.className = 'skinXport-configuration-section';
    appendApplyButton(configurationSection);
    marketHeader.prepend(configurationSection);
}

const configStartupObserver = new MutationObserver((mutationsList, configStartupObserver) => {
    for (let mutation of mutationsList) {
        if (mutation.addedNodes.length) {
            const marketHeader = document.querySelector('.CatalogPage-content');
            if (marketHeader) {
                addConfigurationSection(marketHeader);
                configStartupObserver.disconnect();
                break;
            }
        }
    }
});

function appendApplyButton(element) {
    const applyButton = document.createElement('button');
    applyButton.innerText = 'Save';
    applyButton.className = 'skinXport-button';
    element.append(applyButton);
}

configStartupObserver.observe(document, { childList: true, subtree: true });
// Initialize variables
let duckweed = 100000;
let duckweedPerSecond = 0; // CHECK IF BOUGHT UPGRADES!!! @TODO
let duckweedMaxStorage = 100000; // Maximum amount of duckweed that can be stored until upgrades
let clickMultiplier = 1.0; // Boost to duckweed per click



// Village related variables
let happiness = 100;
let population = 0;
let science = 0;
let wood = 0;
let minerals = 0;
let gold = 0;
let dragons = 0;

// Building counts
let smallHouseCount = 0;
let schoolCount = 0;
let lumberMillCount = 0;
let mineCount = 0;
let tradePostCount = 0;
let tavernCount = 0;
let warehouseCount = 0;

// Production rates
let woodProduction = 0;
let mineralsProduction = 0;
let goldProduction = 0;


// Cache DOM elements
const gameContainer = document.getElementById('game-container');

// Function to create and append a new element
function createElement(type, id, content, parent, clickHandler) {
    const element = document.createElement(type);
    if (id) element.id = id;
    if (content) element.textContent = content;
    if (clickHandler) element.addEventListener('click', clickHandler);
    parent.appendChild(element);
    return element;
}

// Function to switch between tabs
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none'); // Hide all tabs
    document.getElementById(tabName).style.display = 'block'; // Show the selected tab
}

// ------------------------------------- //
// Buildings and their effects
const buildings = {
    smallHouse: {
        name: 'Small House',
        baseCost: { wood: 20, minerals: 5, gold: 0 },
        effect: () => {
            population += 1;
            smallHouseCount++;
            updateUI();
        },
    },
    school: {
        name: 'School',
        baseCost: { wood: 50, minerals: 10, gold: 0 },
        effect: () => {
            science += 1;
            schoolCount++;
            updateUI();
        },
    },
    lumberMill: {
        name: 'Lumber Mill',
        baseCost: { wood: 10, minerals: 0, gold: 0 },
        effect: () => {
            woodProduction += 0.4; // Production per second
            lumberMillCount++;
            if (lumberMillCount === 1) {
                setInterval(() => wood += woodProduction, 1000);
            }
            updateUI();
        },
    },
    mine: {
        name: 'Mine',
        baseCost: { wood: 40, minerals: 0, gold: 0 },
        effect: () => {
            mineralsProduction += 0.1; // Production per second
            goldProduction += 0.0001; // Production per second
            mineCount++;
            if (mineCount === 1) {
                setInterval(() => {
                    minerals += mineralsProduction;
                    gold += goldProduction;
                }, 1000);
            }
            updateUI();
        },
    },
    tradePost: {
        name: 'Trade Post',
        baseCost: { wood: 100, minerals: 20, gold: 10 },
        effect: () => {
            // Implement trade logic here
            tradePostCount++;
            updateUI();
        },
    },
    tavern: {
        name: 'Tavern',
        baseCost: { wood: 80, minerals: 15, gold: 5 },
        effect: () => {
            setInterval(() => {
                if (happiness < 100) {
                    happiness += 1;
                } else {
                    gold += 0.0002;
                }
            }, 1000);
            tavernCount++;
            updateUI();
        },
    },
    warehouse: {
        name: 'Warehouse',
        baseCost: { wood: 60, minerals: 12, gold: 0 },
        effect: () => {
            const storageIncrease = 0.10; // 10% increase
            duckweedMaxStorage *= (1 + storageIncrease);
            warehouseCount++;
            updateUI();
        },
    },
};


// ------------------------------------- //
// Event listener functions
function buildSmallHouse() {
    if (wood >= buildings.smallHouse.baseCost.wood && minerals >= buildings.smallHouse.baseCost.minerals) {
        wood -= buildings.smallHouse.baseCost.wood;
        minerals -= buildings.smallHouse.baseCost.minerals;
        buildings.smallHouse.effect();
    } else {
        alert("Not enough resources to build Small House!");
    }
}

function buildSchool() {
    if (wood >= buildings.school.baseCost.wood && minerals >= buildings.school.baseCost.minerals) {
        wood -= buildings.school.baseCost.wood;
        minerals -= buildings.school.baseCost.minerals;
        buildings.school.effect();
    } else {
        alert("Not enough resources to build School!");
    }
}

function buildLumberMill() {
    if (wood >= buildings.lumberMill.baseCost.wood) {
        wood -= buildings.lumberMill.baseCost.wood;
        buildings.lumberMill.effect();
    } else {
        alert("Not enough resources to build Lumber Mill!");
    }
}

function buildMine() {
    if (wood >= buildings.mine.baseCost.wood && minerals >= buildings.mine.baseCost.minerals) {
        wood -= buildings.mine.baseCost.wood;
        minerals -= buildings.mine.baseCost.minerals;
        buildings.mine.effect();
    } else {
        alert("Not enough resources to build Mine!");
    }
}

function buildTradePost() {
    if (wood >= buildings.tradePost.baseCost.wood && minerals >= buildings.tradePost.baseCost.minerals && gold >= buildings.tradePost.baseCost.gold) {
        wood -= buildings.tradePost.baseCost.wood;
        minerals -= buildings.tradePost.baseCost.minerals;
        gold -= buildings.tradePost.baseCost.gold;
        buildings.tradePost.effect();
    } else {
        alert("Not enough resources to build Trade Post!");
    }
}

function buildTavern() {
    if (wood >= buildings.tavern.baseCost.wood && minerals >= buildings.tavern.baseCost.minerals && gold >= buildings.tavern.baseCost.gold) {
        wood -= buildings.tavern.baseCost.wood;
        minerals -= buildings.tavern.baseCost.minerals;
        gold -= buildings.tavern.baseCost.gold;
        buildings.tavern.effect();
    } else {
        alert("Not enough resources to build Tavern!");
    }
}

function buildWarehouse() {
    if (wood >= buildings.warehouse.baseCost.wood && minerals >= buildings.warehouse.baseCost.minerals) {
        wood -= buildings.warehouse.baseCost.wood;
        minerals -= buildings.warehouse.baseCost.minerals;
        buildings.warehouse.effect();
    } else {
        alert("Not enough resources to build Warehouse!");
    }
}



// Function to create the game UI dynamically
function createGameUI() {
    // Create a main container that wraps the inventory and game
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-container';
    document.body.appendChild(mainContainer);

    // Create inventory box
    const inventoryContainer = createElement('div', 'inventory-container', '', mainContainer);
    createElement('h2', null, 'Inventory', inventoryContainer);
    createElement('p', 'inventoryDuckweed', `Duckweed: ${duckweed}/${duckweedMaxStorage}`, inventoryContainer);
    createElement('p', 'inventoryWood', `Wood: ${wood}`, inventoryContainer);
    
    // Create game container
    const gameContainer = createElement('div', 'game-container', '', mainContainer);

    // Create game title
    createElement('h1', null, 'Ducks and Ducks', gameContainer);

    // Create Duckweed display
    createElement('p', 'duckweedDisplay', 'Duckweed: ', gameContainer);
    createElement('span', 'duckweedCount', '0', gameContainer);

    // Create Gather Duckweed button
    const gatherButton = createElement('button', 'gatherButton', 'Gather Duckweed', gameContainer);
    gatherButton.addEventListener('mousedown', () => {
        if (duckweed >= duckweedMaxStorage) return; // Don't gather more duckweed if storage is full
        duckweed += 1;
        updateUI();
    
    });
    gatherButton.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent "Enter" from triggering the button
        }
    });

    // Create Refine Duckweed button
    const refineButton = createElement('button', 'refineButton', 'Refine Duckweed (Convert 100 Duckweed to 1 Wood)', gameContainer);

    refineButton.addEventListener('click', () => {
        if (duckweed >= 100) { // Check if there is enough duckweed
            wood += 1; // Convert 100 duckweed to 1 wood
            duckweed -= 100; // Subtract 100 duckweed
            updateUI(); // Update the UI to reflect changes
        } else {
            alert("Not enough duckweed to refine!"); // Optional: Alert if there isn't enough duckweed
        }
    });


    // Create Buy Duck button
    const buyDuckButton = createElement('button', 'buyDuck', 'Buy Duck (Cost: 100 Duckweed)', gameContainer);
    buyDuckButton.addEventListener('click', () => {
        store.upgrades[1].buy();
        checkUnlockVillage(); 
    });
    createElement('p', 'duckCount', 'Ducks: 0', gameContainer);

    // Create tab navigation
    const tabNav = createElement('div', 'tabNav', '', gameContainer);
    createElement('button', null, 'Upgrades', tabNav, () => switchTab('upgradesTab'));
    createElement('button', null, 'Stats', tabNav, () => switchTab('statsTab'));

    // Create tab contents (Upgrades and Stats)
    const upgradesTab = createElement('div', 'upgradesTab', '', gameContainer);
    upgradesTab.className = 'tab-content';

    const statsTab = createElement('div', 'statsTab', '', gameContainer);
    statsTab.className = 'tab-content';
    statsTab.style.display = 'none'; // Hide stats tab initially

    // Create Upgrades section inside Upgrades tab
    createElement('h2', null, 'Upgrades', upgradesTab);

    // Duckweed Farm Upgrade
    const buyFarmButton = createElement('button', 'buyFarm', 'Buy Duckweed Farm (Cost: 50 Duckweed)', upgradesTab);
    buyFarmButton.addEventListener('click', () => store.upgrades[0].buy());
    createElement('p', 'farmCount', 'Duckweed Farms: 0', upgradesTab);
    createElement('p', 'duckweedPerSecond', 'Duckweed per second: 0', upgradesTab);

    // Silo Upgrade
    const buySiloButton = createElement('button', 'buySilo', 'Buy Silo (Cost: 500 Duckweed)', upgradesTab);
    buySiloButton.addEventListener('click', () => store.upgrades[2].buy());
    createElement('p', 'siloCount', 'Silos: 0', upgradesTab);

    // Better Tools Upgrade
    const buyToolsButton = createElement('button', 'buyTools', 'Buy Better Tools (Cost: 2000 Duckweed)', upgradesTab);
    buyToolsButton.addEventListener('click', () => store.boosts[0].buy());
    createElement('p', 'toolsCount', 'Better Tools: 0', upgradesTab);

    // Create Stats section inside Stats tab
    createElement('h2', null, 'Game Stats', statsTab);
    createElement('p', 'duckweedPerSecondStat', 'Duckweed per second: 0', statsTab);
    createElement('p', 'duckweedStorageStat', `Duckweed Storage: ${duckweedMaxStorage}`, statsTab);
    createElement('p', 'duckweedLeftStat', `Storage Left: ${duckweedMaxStorage - duckweed}`, statsTab);
}
// Create the village UI
function createVillageUI() {
    // Create village container with styling
    const villageContainer = createElement('div', 'village-container', '', document.getElementById('main-container'));
    villageContainer.style.backgroundColor = '#fff';
    villageContainer.style.padding = '15px';
    villageContainer.style.borderRadius = '10px';
    villageContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    villageContainer.style.width = '300px'; // Match the width of other containers

    // Create village title
    createElement('h2', null, 'Village', villageContainer);

    // Create resources display
    createElement('p', 'scienceDisplay', `Science: ${science}`, villageContainer);
    createElement('p', 'woodDisplay', `Wood: ${wood} (Production: ${woodProduction}/s)`, villageContainer);
    createElement('p', 'mineralsDisplay', `Minerals: ${minerals} (Production: ${mineralsProduction}/s)`, villageContainer);
    createElement('p', 'goldDisplay', `Gold: ${gold} (Production: ${goldProduction}/s)`, villageContainer);
    createElement('p', 'dragonsDisplay', `Dragons: ${dragons}`, villageContainer);

    // Create building counts
    createElement('p', 'smallHouseCount', `Small Houses: ${smallHouseCount}`, villageContainer);
    createElement('p', 'schoolCount', `Schools: ${schoolCount}`, villageContainer);
    createElement('p', 'lumberMillCount', `Lumber Mills: ${lumberMillCount}`, villageContainer);
    createElement('p', 'mineCount', `Mines: ${mineCount}`, villageContainer);
    createElement('p', 'tradePostCount', `Trade Posts: ${tradePostCount}`, villageContainer);
    createElement('p', 'tavernCount', `Taverns: ${tavernCount}`, villageContainer);
    createElement('p', 'warehouseCount', `Warehouses: ${warehouseCount}`, villageContainer);

    // Create buildings section
    createElement('h3', null, 'Buildings', villageContainer);

    // Building buttons with tooltips
    const smallHouseButton = createElement('button', 'smallHouseButton', 'Build Small House', villageContainer);
    smallHouseButton.dataset.cost = `Cost: ${buildings.smallHouse.baseCost.wood} Wood, ${buildings.smallHouse.baseCost.minerals} Minerals`;
    smallHouseButton.addEventListener('click', buildSmallHouse);

    const schoolButton = createElement('button', 'schoolButton', 'Build School', villageContainer);
    schoolButton.dataset.cost = `Cost: ${buildings.school.baseCost.wood} Wood, ${buildings.school.baseCost.minerals} Minerals`;
    schoolButton.addEventListener('click', buildSchool);


    const lumberMillButton = createElement('button', 'lumberMillButton', 'Build Lumber Mill', villageContainer);
    lumberMillButton.dataset.cost = `Cost: ${buildings.lumberMill.baseCost.wood} Wood`;
    lumberMillButton.addEventListener('click', buildLumberMill);

    const mineButton = createElement('button', 'mineButton', 'Build Mine', villageContainer);
    mineButton.dataset.cost = `Cost: ${buildings.mine.baseCost.wood} Wood, ${buildings.mine.baseCost.minerals} Minerals`;
    mineButton.addEventListener('click', buildMine);

    const tradePostButton = createElement('button', 'tradePostButton', 'Build Trade Post', villageContainer);
    tradePostButton.dataset.cost = `Cost: ${buildings.tradePost.baseCost.wood} Wood, ${buildings.tradePost.baseCost.minerals} Minerals, ${buildings.tradePost.baseCost.gold} Gold`;
    tradePostButton.addEventListener('click', buildTradePost);

    const tavernButton = createElement('button', 'tavernButton', 'Build Tavern', villageContainer);
    tavernButton.dataset.cost = `Cost: ${buildings.tavern.baseCost.wood} Wood, ${buildings.tavern.baseCost.minerals} Minerals`;
    tavernButton.addEventListener('click', buildTavern);

    const warehouseButton = createElement('button', 'warehouseButton', 'Build Warehouse', villageContainer);
    warehouseButton.dataset.cost = `Cost: ${buildings.warehouse.baseCost.wood} Wood, ${buildings.warehouse.baseCost.minerals} Minerals`;
    warehouseButton.addEventListener('click', buildWarehouse);

    // Initialize UI with current values
    updateVillageUI();
}


// Update UI elements

function updateUI() {
    document.getElementById('duckweedCount').textContent = duckweed.toFixed(3);
    document.getElementById('inventoryDuckweed').textContent = `Duckweed: ${duckweed.toFixed(3)}/${duckweedMaxStorage.toFixed(3)}`;
    document.getElementById('inventoryWood').textContent = `Wood: ${wood.toFixed(3)}`;
    document.getElementById('farmCount').textContent = store.upgrades[0].owned.toFixed(3);
    document.getElementById('duckCount').textContent = store.upgrades[1].owned.toFixed(3);
    document.getElementById('duckweedPerSecond').textContent = duckweedPerSecond.toFixed(3);

    // Update Stats tab content
    document.getElementById('duckweedPerSecondStat').textContent = `Duckweed per second: ${duckweedPerSecond.toFixed(3)}`;
    document.getElementById('duckweedStorageStat').textContent = `Duckweed Storage: ${duckweedMaxStorage.toFixed(3)}`;
    document.getElementById('duckweedLeftStat').textContent = `Storage Left: ${(duckweedMaxStorage - duckweed).toFixed(3)}`;

    // Update cost displays
    document.getElementById('buyFarm').textContent = `Buy Duckweed Farm (Cost: ${store.upgrades[0].getCost().toFixed(3)} Duckweed)`;
    document.getElementById('buyDuck').textContent = `Buy Duck (Cost: ${store.upgrades[1].getCost().toFixed(3)} Duckweed)`;
    document.getElementById('buySilo').textContent = `Buy Silo (Cost: ${store.upgrades[2].getCost().toFixed(3)} Duckweed)`;

    // Update inventory display
    document.getElementById('inventoryDuckweed').textContent = `Duckweed: ${duckweed.toFixed(3)}/${duckweedMaxStorage.toFixed(3)}`;
    document.getElementById('inventoryWood').textContent = `Wood: ${wood.toFixed(3)}`;

    // Update village UI
    updateVillageUI();
}



// Function to update the village UI

function updateVillageUI() {
    const scienceDisplay = document.getElementById('scienceDisplay');
    const woodDisplay = document.getElementById('woodDisplay');
    const mineralsDisplay = document.getElementById('mineralsDisplay');
    const goldDisplay = document.getElementById('goldDisplay');
    const dragonsDisplay = document.getElementById('dragonsDisplay');
    const smallHouseCount = document.getElementById('smallHouseCount');
    const schoolCount = document.getElementById('schoolCount');
    const lumberMillCount = document.getElementById('lumberMillCount');
    const mineCount = document.getElementById('mineCount');
    const tradePostCount = document.getElementById('tradePostCount');
    const tavernCount = document.getElementById('tavernCount');
    const warehouseCount = document.getElementById('warehouseCount');

    if (scienceDisplay) {
        scienceDisplay.textContent = `Science: ${science.toFixed(3)}`;
    }
    if (woodDisplay) {
        woodDisplay.textContent = `Wood: ${wood.toFixed(3)} (Production: ${woodProduction.toFixed(3)}/s)`;
    }
    if (mineralsDisplay) {
        mineralsDisplay.textContent = `Minerals: ${minerals.toFixed(3)} (Production: ${mineralsProduction.toFixed(3)}/s)`;
    }
    if (goldDisplay) {
        goldDisplay.textContent = `Gold: ${gold.toFixed(3)} (Production: ${goldProduction.toFixed(3)}/s)`;
    }
    if (dragonsDisplay) {
        dragonsDisplay.textContent = `Dragons: ${dragons.toFixed(3)}`;
    }
    if (smallHouseCount) {
        smallHouseCount.textContent = `Small Houses: ${smallHouseCount.toFixed(3)}`;
    }
    if (schoolCount) {
        schoolCount.textContent = `Schools: ${schoolCount.toFixed(3)}`;
    }
    if (lumberMillCount) {
        lumberMillCount.textContent = `Lumber Mills: ${lumberMillCount.toFixed(3)}`;
    }
    if (mineCount) {
        mineCount.textContent = `Mines: ${mineCount.toFixed(3)}`;
    }
    if (tradePostCount) {
        tradePostCount.textContent = `Trade Posts: ${tradePostCount.toFixed(3)}`;
    }
    if (tavernCount) {
        tavernCount.textContent = `Taverns: ${tavernCount.toFixed(3)}`;
    }
    if (warehouseCount) {
        warehouseCount.textContent = `Warehouses: ${warehouseCount.toFixed(3)}`;
    }
}





// Initialize village functionality when 10 ducks are bought
function checkUnlockVillage() {
    if (store.upgrades[1].owned >= 10 && !document.getElementById('village-container')) {
        createVillageUI();
    }
}



setInterval(() => {
    const potentialDuckweed = duckweed + duckweedPerSecond;
    if (potentialDuckweed > duckweedMaxStorage) {
        duckweed = duckweedMaxStorage; // Cap duckweed at max storage
    } else {
        duckweed += duckweedPerSecond;
    }
    updateUI();
    
}, 1000);


// Create the game UI when the page loads
window.onload = createGameUI;

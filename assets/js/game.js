// Initialize game variables
let duckweed = 0;  // Initial duckweed count
let duckweedTotalOwned = 0; // Total amount of duckweed owned since the beginning of the game
let duckweedPerClick = 1;  // Duckweed gained per click
let duckweedPerSecond = 0;  // Duckweed generated per second
let duckweedMaxStorage = 1000;  // Maximum amount of duckweed the player can hold
let clickMultiplier = 1;  // Multiplier for click-based duckweed collection

// Village stuff


let wood = 0;
let minerals = 0; // Minerals found in the village
let mineralsPerSecond = 0; // Minerals generated per second
let mineralsMaxStorage = 1000; // Maximum amount of minerals the player can hold
let farms = 0; // Example variable for requirements

// Duck related stuff
let ducks = 0; // Number of ducks in the village
let duckweedPerDuck = 0.1; // Duckweed consumed per duck per second
let maxDucks = 0; // Maxium ducks that live in the village (Upgrades such as Small hut increase this)
let ducksMovedAway = 0; // Ducks that have moved away from the village due to lack of food
let duckHappiness = 100; // Happiness of the ducks, if it reaches 0, ducks will move away // 100 is the max happiness and every duck 
// starts with 100 happiness

// Secrets ;)
let unicorn = 0; // Unicorns should be able to be found after unlocking "something something"


// Story 
let story1UnlockedWood = false;
let story1DuckMovedAway = false; 
let story1Shown = false;
let storyTenaraMapUnlocked = false; // Unlocks the Tenara map TBD


const h3Elements = document.querySelectorAll('.upgrboost');

// Function to handle clicking to gather duckweed
function gatherDuckweed() {
    let gain = duckweedPerClick * clickMultiplier;
    if (duckweed + gain > duckweedMaxStorage) {
        gain = duckweedMaxStorage - duckweed;
    }
    duckweed += gain;
    duckweedTotalOwned += gain;  // Increment total owned
    updateUI();  // Update the UI after gathering duckweed
}

function refineDuckweed() {
    if (duckweed >= 100) {
        duckweed -= 100;
        wood += 1;
        updateUI();
    }
}


function gatherWood() {
    // Check if the player has unlocked the lumber mill
    // If true, the lumber mill will gather wood automatically, 0.1 wood per second * number of lumber mills
    if (store.buildings.find(u => u.name === 'Lumber Mill')?.owned > 0) {
        wood += store.buildings.find(u => u.name === 'Lumber Mill')?.owned * 0.1;
    }
    
}


// Function to handle buying store upgrades
function buyUpgrade(index) {
    const upgrade = store.upgrades[index];
    const cost = upgrade.getCost();  // Define `cost` by calling `getCost` on the upgrade object
    
    // Purchase the upgrade if the player has enough duckweed
    if (duckweed >= cost) {
        upgrade.buy();
        logEvent(`Bought ${upgrade.name} for ${cost} duckweed.`);
    } else {
        logEvent(`Not enough duckweed to buy ${upgrade.name}. Cost: ${cost}`);
    }
    updateUI();
}

// Function to handle buying store boosts
function buyBoost(index) {
    const boost = store.boosts[index];  // Access the boost object
    const cost = boost.getCost();  // Call getCost on the specific boost object
    const mineralCost = boost.getMineralCost ? boost.getMineralCost() : 0; // Check if getMineralCost exists

    // Purchase the boost if the player has enough duckweed and minerals
    if (duckweed >= cost && minerals >= mineralCost) {
        boost.buy();  // Call buy on the specific boost object
        logEvent(`Bought ${boost.name} for ${cost} duckweed and ${mineralCost} minerals.`);
    } else {
        logEvent(`Not enough resources to buy ${boost.name}. Cost: ${cost} duckweed, ${mineralCost} minerals`);
    }
    updateUI();
}



// Function to update the game UI
function updateUI() {
    // Update duckweed count
    document.getElementById('duckweedCount').innerText = Math.floor(duckweed * 100) / 100 + "/" + duckweedMaxStorage; // Round down to 2 decimal places
    document.getElementById('woodCount').innerText = wood;
    // hide the refine button if the player has less than 100 duckweed
    document.getElementById('refineDuckweed').style.display = duckweedTotalOwned >= 100 ? 'inline-block' : 'none';
    document.getElementById('woodCountText').style.display = duckweedTotalOwned >=100 ? 'inline-block' : 'none';

    // Show upgrades and update their states based on total duckweed owned
    store.upgrades.forEach((upgrade, index) => {
        const cost = upgrade.getCost();
        const button = document.getElementById(`upgrade-${index}`);

        if (duckweedTotalOwned >= upgrade.baseCost) {
            button.style.display = 'inline-block';  // Make the button visible
            // Set tooltip information for the button
            button.setAttribute('data-tooltip', `${upgrade.perSecond > 0 ? '+' + upgrade.perSecond + ' duckweed/sec' : 'Increases storage capacity'} (Cost: ${cost})`);
        } else {
            button.style.display = 'none';  // Hide the button
        }

        button.innerHTML = `${upgrade.name} (Cost: ${cost}, Owned: ${upgrade.owned})`;

        if (duckweed >= cost) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    // Show boosts and update their states based on total duckweed owned
    store.boosts.forEach((boost, index) => {
        const cost = boost.getCost();
        const button = document.getElementById(`boost-${index}`);
        let tooltipText;

        if (duckweedTotalOwned >= boost.baseCost) {
            button.style.display = 'inline-block';  // Make the button visible

            // Determine tooltip text based on the boost properties
            if (boost.clickMultiplierIncrease) {
                tooltipText = `Increases click multiplier by ${Math.round(boost.clickMultiplierIncrease * 100)}%. (Cost: ${cost}${boost.mineralsCost ? ' + ' + boost.getMineralCost() + 'm' : ''})`;
            } else if (boost.perSecond > 0) {
                tooltipText = `+${boost.perSecond} duckweed/sec (Cost: ${cost}${boost.mineralsCost ? ' + ' + boost.getMineralCost() + ' minerals' : ''})`;
            } else {
                tooltipText = `Increases revenue (Cost: ${cost}${boost.mineralsCost ? ' + ' + boost.getMineralCost() + ' minerals' : ''})`;
            }

            button.setAttribute('data-tooltip', tooltipText);
        } else {
            button.style.display = 'none';  // Hide the button
        }

        button.innerHTML = `${boost.name} (Cost: ${cost}${boost.mineralsCost ? ' + ' + boost.getMineralCost() + ' minerals' : ''}, Owned: ${boost.owned})`;

        // Disable the button if maxOwned is reached or if player cannot afford it
        if (boost.owned >= boost.maxOwned || duckweed < cost) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    });

    // Check if any upgrades or boosts are visible and toggle the <h3> visibility
    let anyVisibleUpgrades = store.upgrades.some(upgrade => duckweedTotalOwned >= upgrade.baseCost);
    let anyVisibleBoosts = store.boosts.some(boost => duckweedTotalOwned >= boost.baseCost);

    // If no upgrades or boosts are visible, hide the h3 elements
    h3Elements.forEach(h3 => {
        if (!anyVisibleUpgrades && !anyVisibleBoosts) {
            h3.style.display = 'none';
        } else {
            h3.style.display = 'block';
        }
    });

    // Update the upgrade contribution section
    let contributionText = '';
    store.upgrades.forEach(upgrade => {
        if (upgrade.owned > 0) {
            contributionText += `${upgrade.name}: ${upgrade.perSecond * upgrade.owned} duckweed/sec<br>`;
        }
    });

    // Set the contribution details in the upgrade contributions element
    document.getElementById('upgradeContributions').innerHTML = contributionText;

    // Optionally, you can also update the total per second display if you want
    document.getElementById('duckweedPerSecondDisplay').innerText = `${duckweedPerSecond}`;
}


function logEvent(message) {
    const logBox = document.getElementById('game-log');
    const logEntry = document.createElement('p');
    logEntry.innerText = message;
    logBox.appendChild(logEntry);

    // Scroll to the bottom of the log box to show the latest message
    logBox.scrollTop = logBox.scrollHeight;
}


// Redo this function to include more variables and more "randomness"
function randomCheck() {
    // Determine if an event should occur (5% chance)
    if (Math.random() < 0.005) {
        // Filter events that have no requirement or meet the requirement
        const availableEvents = events.filter(event => 
            !event.requirement || event.requirement(getGameState())
        );
        
        // Randomly select an event from available events
        if (availableEvents.length > 0) {
            const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            randomEvent.action();
            logEvent(`Event Triggered: ${randomEvent.name}`);
        }
    }
}

// Redo this fucntion to include more variables and return them
function getGameState() {
    return {
        farms: store.upgrades.find(u => u.name === 'Farms')?.owned || 0,
        duckweedTotalOwned: duckweedTotalOwned,
        ducks: ducks
    };
}

// Function to handle the Story Line - This function should be redone to include more variables and more story events
function storyLine() {
    if (duckweedTotalOwned >= 100 && !story1UnlockedWood) {
        story1UnlockedWood = true;
        logEvent('You have gathered enough duckweed to unlock the ability to refine duckweed into wood!');
    }

    if (duckweedTotalOwned >= 1000 && !story1Shown) {
        story1Shown = true;
        logEvent('You have enough duckweed to attract new visitors to your village!');
    }

    if (ducks > 0 && duckweed < duckweedPerDuck * ducks) {
        logEvent('The ducks are starving...');
        duckweedEaten(); // Ensure ducks consume what they can
    }

    if (ducksMovedAway > 0 && !story1DuckMovedAway) {
        story1DuckMovedAway = true;
        logEvent('Some ducks have moved away from the village due to lack of food...');
    }
}

// Function to handle ducks moving away from the village
function duckMovedAwayFunc() {
    ducksMovedAway += 1;
    ducks -= 1;
}
// Function for ducks to move into the village (if there is space)
function duckMovedIn() {
    if (ducks < maxDucks) {
        ducks += 1;
    }
    else {
        const duckGender = Math.random() < 0.5 ? 'he' : 'she';
        const possessivePronoun = duckGender === 'he' ? 'him' : 'her';
        const message = `A duck has come to the village, but there was no room for ${possessivePronoun}. ${duckGender.charAt(0).toUpperCase() + duckGender.slice(1)} left...`;
        logEvent(message);
        
        
    }
}

// Function for ducks to eat duckweed, @TODO: add a happiness variable to ducks and make them leave if they are unhappy
function duckweedEaten() {
    if (duckweed >= duckweedPerDuck * ducks) {
        duckweed -= duckweedPerDuck * ducks;
    }
    else {
        logEvent('The ducks are starving...');
    }
}


// Main game loop (runs every second) // redefine this function
function gameLoop() {
    if (duckweed + duckweedPerSecond <= duckweedMaxStorage) {
        duckweed += duckweedPerSecond;  // Auto-gather duckweed per second
    } else {
        duckweed = duckweedMaxStorage;
    }
    
    updateUI();  // Update the UI
    storyLine(); // Check if a story event should occur
    randomCheck(); // Check if a random event should occur
    duckweedEaten();
}

// Start the game loop
setInterval(gameLoop, 1000);  // Runs the game loop function every second

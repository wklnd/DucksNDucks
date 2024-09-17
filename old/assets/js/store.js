// Store object for upgrades
const store = {
    upgrades: [
        {
            name: 'Duckweed Farm',
            baseCost: 50,
            costMultiplier: 1.2, // Each purchase increases the cost by 20%
            perSecond: 0.5, // 0.5 Duckweed per second, may vary depending on the upgrade
            owned: 0,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                if (duckweed >= cost) {
                    duckweed -= cost;
                    this.owned += 1;
                    duckweedPerSecond += this.perSecond;
                    updateUI();
                }
            }
        },
        {
            name: 'Duck',
            baseCost: 100,
            costMultiplier: 1.5, // Each purchase increases the cost by 50%
            special: function () {
                // Ducks could have special abilities (e.g. gathering speed boost)
            },
            owned: 0,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                if (duckweed >= cost) {
                    duckweed -= cost;
                    this.owned += 1;
                    this.special(); // Call duck special ability if you want
                    updateUI();
                }
            }
        },
        {
            name: 'Silo',
            baseCost: 500,
            costMultiplier: 1.4, // Each purchase increases the cost by 40%
            perSecond: 0.0, // Doesnt produce duckweed, increases storage capacity
            storageCapacityIncreaseMultiplier: 1.4,
            owned: 0,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                if (duckweed >= cost) {
                    duckweed -= cost;
                    this.owned += 1;
                    duckweedMaxStorage *= this.storageCapacityIncreaseMultiplier;
                    updateUI();
                }
            }
        },
        {
            name: 'Pasture',
            baseCost: 1000,
            costMultiplier: 2.0,
            perSecond: 0.0,
            storageCapacityIncreaseMultiplier: 1.0,
            owned: 0,
            duckweedUsedMultiplier: 0.90,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                if (duckweed >= cost) {
                    duckweed -= cost;
                    this.owned += 1;
                    duckweedMaxStorage *= this.storageCapacityIncreaseMultiplier;
                    updateUI();
                }
            }
        }
    ],
    boosts: [
        {
            name: 'Better Tools',
            baseCost: 2000,
            costMultiplier: 1.0,
            clickMultiplierIncrease: 0.2,
            perSecond: 1.4,
            owned: 0,
            maxOwned: 1,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                if (duckweed >= cost) {
                    duckweed -= cost;
                    this.owned += 1;
                    clickMultiplier += this.clickMultiplierIncrease;
                    updateUI();
                }
            }
        },
        {
            name: 'Revenue Tracker',
            baseCost: 300,
            costMultiplier: 1.4,
            revenueBoost: 0.1,
            owned: 0,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                if (duckweed >= cost) {
                    duckweed -= cost;
                    this.owned += 1;
                    duckweedPerSecond *= (1 + this.revenueBoost);
                    updateUI();
                }
            }
        }
    ]
};

// Event listeners for buying upgrades
document.getElementById('buyFarm').addEventListener('click', () => store.upgrades[0].buy());
document.getElementById('buyDuck').addEventListener('click', () => store.upgrades[1].buy());
document.getElementById('buySilo').addEventListener('click', () => store.upgrades[2].buy());
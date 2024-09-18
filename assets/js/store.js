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
            name: 'Pasture - DONT TOUCH',
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
    buildings: [
        {
            name: 'Small hut',
            baseCost: 500,
            baseCostWood: 100,
            baseCostMinerals: 50, // Add mineral cost
            costMultiplier: 1.6,
            livableSpace: 2,
            owned: 0,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            getWoodCost() {
                return Math.round(this.baseCostWood * Math.pow(this.costMultiplier, this.owned));
            },
            getMineralCost() {
                return Math.round(this.baseCostMinerals * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                const woodCost = this.getWoodCost();
                const mineralCost = this.getMineralCost();
                if (duckweed >= cost && wood >= woodCost && minerals >= mineralCost) {
                    duckweed -= cost;
                    wood -= woodCost;
                    minerals -= mineralCost;
                    this.owned += 1;
                    updateUI();
                } else {
                    if (duckweed < cost) {
                        logEvent(`Not enough duckweed to buy ${this.name}. Cost: ${cost}`);
                    }
                    if (wood < woodCost) {
                        logEvent(`Not enough wood to buy ${this.name}. Cost: ${woodCost}`);
                    }
                    if (minerals < mineralCost) {
                        logEvent(`Not enough minerals to buy ${this.name}. Cost: ${mineralCost}`);
                    }
                }
            }
        },
        {
            name: 'Two story house',
            baseCost: 1240,
            baseCostWood: 200,
            baseCostMinerals: 100, // Add mineral cost
            costMultiplier: 1.93,
            perSecond: 0.0,
            storageCapacityIncreaseMultiplier: 1.0,
            owned: 0,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            getWoodCost() {
                return Math.round(this.baseCostWood * Math.pow(this.costMultiplier, this.owned));
            },
            getMineralCost() {
                return Math.round(this.baseCostMinerals * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                const woodCost = this.getWoodCost();
                const mineralCost = this.getMineralCost();
                if (duckweed >= cost && wood >= woodCost && minerals >= mineralCost) {
                    duckweed -= cost;
                    wood -= woodCost;
                    minerals -= mineralCost;
                    this.owned += 1;
                    updateUI();
                } else {
                    if (duckweed < cost) {
                        logEvent(`Not enough duckweed to buy ${this.name}. Cost: ${cost}`);
                    }
                    if (wood < woodCost) {
                        logEvent(`Not enough wood to buy ${this.name}. Cost: ${woodCost}`);
                    }
                    if (minerals < mineralCost) {
                        logEvent(`Not enough minerals to buy ${this.name}. Cost: ${mineralCost}`);
                    }
                }
            }
        },
        {
            name: 'Pasture - DONT TOUCH',
            baseCost: 1000,
            baseCostWood: 300,
            baseCostMinerals: 150, // Add mineral cost
            costMultiplier: 2.0,
            perSecond: 0.0,
            storageCapacityIncreaseMultiplier: 1.0,
            owned: 0,
            duckweedUsedMultiplier: 0.90,
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            getWoodCost() {
                return Math.round(this.baseCostWood * Math.pow(this.costMultiplier, this.owned));
            },
            getMineralCost() {
                return Math.round(this.baseCostMinerals * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                const cost = this.getCost();
                const woodCost = this.getWoodCost();
                const mineralCost = this.getMineralCost();
                if (duckweed >= cost && wood >= woodCost && minerals >= mineralCost) {
                    duckweed -= cost;
                    wood -= woodCost;
                    minerals -= mineralCost;
                    this.owned += 1;
                    updateUI();
                } else {
                    if (duckweed < cost) {
                        logEvent(`Not enough duckweed to buy ${this.name}. Cost: ${cost}`);
                    }
                    if (wood < woodCost) {
                        logEvent(`Not enough wood to buy ${this.name}. Cost: ${woodCost}`);
                    }
                    if (minerals < mineralCost) {
                        logEvent(`Not enough minerals to buy ${this.name}. Cost: ${mineralCost}`);
                    }
                }
            }
        }
    ],
    boosts: [
        {
            name: 'Tools',
            baseCost: 200,
            costMultiplier: 1.0,
            clickMultiplierIncrease: 0.2,
            owned: 0,
            maxOwned: 1, // Set the maximum number of 'Tools' boost
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                if (this.owned < this.maxOwned) { // Check if the maximum owned limit is reached
                    const cost = this.getCost();
                    if (duckweed >= cost) {
                        duckweed -= cost;
                        this.owned += 1;
                        clickMultiplier += this.clickMultiplierIncrease;
                        updateUI();
                    } else {
                        logEvent(`Not enough duckweed to buy ${this.name}. Cost: ${cost}`);
                    }
                } else {
                    logEvent(`Maximum owned limit reached for ${this.name}.`);
                }
            }
        },
        {
            name: 'Even better Tools',
            baseCost: 700,
            costMultiplier: 1.0,
            clickMultiplierIncrease: 0.2,
            owned: 0,
            maxOwned: 1, // Set the maximum number of 'Even better Tools' boost
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                if (this.owned < this.maxOwned) { // Check if the maximum owned limit is reached
                    const cost = this.getCost();
                    if (duckweed >= cost) {
                        duckweed -= cost;
                        this.owned += 1;
                        clickMultiplier += this.clickMultiplierIncrease;
                        updateUI();
                    } else {
                        logEvent(`Not enough duckweed to buy ${this.name}. Cost: ${cost}`);
                    }
                } else {
                    logEvent(`Maximum owned limit reached for ${this.name}.`);
                }
            }
        },
        {
            name: 'Iron Tools',
            baseCost: 700,
            mineralsCost: 100,
            costMultiplier: 1.0,
            clickMultiplierIncrease: 0.2,
            owned: 0,
            maxOwned: 1, 
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            getMineralCost(){
                return Math.round(this.mineralsCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                if (this.owned < this.maxOwned) { // Check if the maximum owned limit is reached
                    const cost = this.getCost();
                    const mineralCost = this.getMineralCost();
                    if (duckweed >= cost && minerals >= mineralCost) {
                        duckweed -= cost;
                        minerals -= mineralCost;
                        this.owned += 1;
                        clickMultiplier += this.clickMultiplierIncrease;
                        updateUI();
                    } else {
                        if (duckweed < cost) {
                            logEvent(`Not enough duckweed to buy ${this.name}. Cost: ${cost}`);
                        } else {
                            logEvent(`Not enough minerals to buy ${this.name}. Cost: ${mineralCost}`);
                        }
                    }
                } else {
                    logEvent(`Maximum owned limit reached for ${this.name}.`);
                }
            }
        },
        {
            name: 'Revenue Tracker',
            baseCost: 300,
            costMultiplier: 1.4,
            revenueBoost: 0.1,
            owned: 0,
            maxOwned: 1, // Set the maximum number of 'Revenue Tracker' boost
            getCost() {
                return Math.round(this.baseCost * Math.pow(this.costMultiplier, this.owned));
            },
            buy() {
                if (this.owned < this.maxOwned) { // Check if the maximum owned limit is reached
                    const cost = this.getCost();
                    if (duckweed >= cost) {
                        duckweed -= cost;
                        this.owned += 1;
                        duckweedPerSecond *= (1 + this.revenueBoost);
                        updateUI();
                    } else {
                        logEvent(`Not enough duckweed to buy ${this.name}. Cost: ${cost}`);
                    }
                } else {
                    logEvent(`Maximum owned limit reached for ${this.name}.`);
                }
            }
        }
    ]
};
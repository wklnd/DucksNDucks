const events = [
    {
        name: 'Duckweed Rain',
        description: 'A sudden rainstorm has caused duckweed to fall from the sky!',
        action() {
            duckweed += 1000;
            logEvent('You found 1000 duckweed on the ground!');
            updateUI();
        },
        requirement: null // No requirement for this event
    },
    {
        name: 'Duckweed Famine',
        description: 'A drought has caused all the duckweed to dry up!',
        action() {
            duckweed -= 1000;
            logEvent('You lost 1000 duckweed to the drought!');
            updateUI();
        },
        requirement: (state) => state.farms >= 4 // Requirement function
    },
    {
        name: 'Duckweed Feast',
        description: 'The local wildlife has eaten all your duckweed!',
        action() {
            duckweed = 0;
            logEvent('The wildlife ate all your duckweed!');
            updateUI();
        },
        requirement: null // No requirement for this event
    },
     {
        name: 'New Visitors',
        description: 'A group of ducks have come to settle down.',
        action() {
            // generate a random number between 1 and 4
            let newDucks = Math.floor(Math.random() * 4) + 1;
            ducks += newDucks;
            logEvent(`You have ${newDucks} new ducks in your village!`);
            updateUI();
        },
        requirement: (state) => state.duckweedTotalOwned >= 1000 // Requirement function

     },
     {
        name: 'Baby Boom!',
        description: 'The ducks feelt the love in the air and now there are more of them!',
        action() {
            // generate a random number between 2 and 6
            let newDucks = Math.floor(Math.random() * 5) + 2;
            ducks += newDucks;
            logEvent(`You have ${newDucks} new ducks in your village!`);
            updateUI();
        },
        requirement: (state) => state.ducks >= 6 // najs ;) // Requirement function
     },
     {
        name: 'Meteor Shower',
        description: 'The night sky is lit up by a meteor shower!',
        action() {
            // generaet a random number between 100 and 300
            let minerals = Math.floor(Math.random() * 200) + 100;
            minerals += 500;
            logEvent(`You found ${minerals} minerals on the ground!`);
            updateUI();
        },
     }

];
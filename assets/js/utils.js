// Example utility function
function roundToNearest(value, nearest) {
    return Math.round(value / nearest) * nearest;
}



function clearCache() {
    localStorage.clear();
    location.reload();
}


// Redo this, save as a text file instead of a JSON file
function saveGame() {
    localStorage.setItem('duckweedSave', JSON.stringify(gameState));
}
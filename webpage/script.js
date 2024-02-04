// Function to load data from the selected JSON file and update the visualization
function loadData(jsonFile) {
    d3.json(jsonFile).then(function(data) {
        // Clear the existing visualization before loading new data
        d3.select("#distplot svg").remove();
        updateVisualization(data);
    });
}

// Load the default dataset on initial load
loadData('household.json'); // Adjust as needed for your default choice

// Add event listener to the dropdown for change events
document.getElementById('dataSelect').addEventListener('change', function() {
    loadData(this.value);
});

document.getElementById('incrementSelect').addEventListener('change', function() {
    // Reset currentYearIndex to 0 or adjust as needed
    currentYearIndex = 0;
    // Restart the animation with the new increment
    animateYears();
});

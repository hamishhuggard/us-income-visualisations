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

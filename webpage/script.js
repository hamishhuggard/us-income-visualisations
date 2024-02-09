// Function to load data from the selected JSON file and update the visualization
function loadData(jsonFile) {
    d3.json(jsonFile).then(function(data) {
        // Clear the existing visualization before loading new data
        d3.select("#distplot svg").remove();
        updateVisualization(data);
    });
}

/*
document.getElementById('incrementSelect').addEventListener('change', function() {
    currentYearIndex = 0;
    animateYears();
});

document.getElementById('dataSelect').addEventListener('change', function() {
  var selectedValue = this.value;
  var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?data=' + selectedValue;
  window.location.href = newUrl;
});
*/
// Function to update the URL based on the dropdown selections
function updateUrl() {
  // Get the selected values from both dropdowns
  var dataSelectValue = document.getElementById('dataSelect').value;
  var incrementSelectValue = document.getElementById('incrementSelect').value;
    console.log(dataSelectValue, incrementSelectValue)
  
  // Redirect to the new URL
  window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + '?data=' + encodeURIComponent(dataSelectValue) + '&increment=' + encodeURIComponent(incrementSelectValue);
}

// Add event listeners to both dropdowns to handle changes
document.getElementById('dataSelect').addEventListener('change', updateUrl);
document.getElementById('incrementSelect').addEventListener('change', updateUrl);

function getQueryParam(param) {
  var queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(param);
}

// Use the function to get the value of the 'data' query parameter
const increment = getQueryParam('increment') || '5';
document.getElementById('incrementSelect').value = increment;

// Use the function to get the value of the 'data' query parameter
const selectedData = getQueryParam('data') || 'household.json';
document.getElementById('dataSelect').value = selectedData;
loadData(selectedData); 

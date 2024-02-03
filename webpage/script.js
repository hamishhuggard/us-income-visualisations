d3.json('data.json').then(function(data) {
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#distplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
        .domain([d3.min(data.binsX), d3.max(data.binsX)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain(data.yLimits)
        .range([height, 0]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(data.labelsX).tickFormat((d, i) => data.labels[i]));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    let currentYearIndex = 0;

    function animateYears() {
        if (currentYearIndex < data.years.length) {
            const year = data.years[currentYearIndex];
            updatePlot(year);
            // Calculate the delay for the current year
            const delay = data.timePerYear[currentYearIndex] * 1000; // Convert seconds to milliseconds
            currentYearIndex++;
            setTimeout(animateYears, delay);
        } else {
            // Optionally, loop the animation
            currentYearIndex = 0; // Reset to start
            animateYears(); // Restart the animation
        }
    }

function updatePlot(year) {
    const values = data.values[year];
    const update = svg.selectAll(".bar").data(values);
    const enter = update.enter().append("rect").attr("class", "bar")
                    .attr("x", (d, i) => x(data.binsX[i]))
                    .attr("width", x(data.binsX[1]) - x(data.binsX[0]) - 1);
    
    // Updating existing bars
    update.merge(enter)
        .transition().duration(1000)
        .attr("y", d => y(d)) // Set the new y position based on the data value
        .attr("height", d => height - y(d)); // Adjust the height from the base to the new y position

    // Removing any bars that no longer have corresponding data
    update.exit().remove();

    d3.select("#plotTitle").text("Distribution for Year: " + year);
}

    // Start the animation
    animateYears();
});


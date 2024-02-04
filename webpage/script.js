d3.json('data.json').then(function(data) {
    
    const margin = {top: 100, right: 70, bottom: 70, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#distplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add title text element
    const title = svg.append("text")
        .attr("class", "chartTitle")
        .attr("x", 0)
        .attr("text-anchor", "start")
        .attr("y", -20) // Position above the chart
        .style("font-size", "20px") // Font size
        .style("fill", "#805a4a") // Font color
        .text(data.title); // Use the title from your data.json

    // Define x and y scales
    const x = d3.scaleLinear()
        .domain([d3.min(data.binsX), d3.max(data.binsX)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain(data.yLimits)
        .range([height, 0]);

    // Add x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(data.labelsX).tickFormat((d, i) => data.labels[i]));

    // Add grid lines for even integer y-values
    svg.selectAll("line.horizontalGrid").data(y.ticks())
        .enter()
        .append("line")
        .attr("class", "horizontalGrid")
        .filter(d => d % 2 === 0) // Only keep the lines for even integer values
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#ddd") // Style the grid lines
        .attr("stroke-width", "1px")
        .attr("shape-rendering", "crispEdges")

    // Add labels for the grid lines on the far right
    svg.selectAll("text.gridLabel").data(y.ticks())
        .enter()
        .filter(d => d % 2 === 0) // Only keep the lines for even integer values
        .append("text")
        .attr("class", "gridLabel")
        .attr("x", width)
        .attr("y", d => y(d)-10) // Position slightly above the grid line
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text(d => d % 1 === 0 ? d : "") // Only label even integer values
        .attr("fill", "#555"); // Style the grid labels

    // Add text element for the year in the top left corner
    const yearLabel = svg.append("text")
        .attr("class", "yearLabel")
        .attr("x", 10) // Adjust position from the left margin
        .attr("y", 40) // Adjust position from the top margin
        .attr("text-anchor", "start")

    let currentYearIndex = 0;

    function animateYears() {
        if (currentYearIndex < data.years.length) {
            const year = data.years[currentYearIndex];
            updatePlot(year);
            // Use timePerYear for delay
            const delay = data.timePerYear[currentYearIndex] * 1000; // Convert seconds to milliseconds
            currentYearIndex++;
            setTimeout(animateYears, delay);
        } else {
            // Optionally reset to start for looping
            currentYearIndex = 0;
            animateYears(); // Optionally restart the animation
        }
    }

    function updatePlot(year) {

        // Update the quartile box
        const quartiles = data.quartiles[currentYearIndex];
        const lowerQuartileX = x(quartiles[0]);
        const upperQuartileX = x(quartiles[1]);
        let quartileBox = svg.selectAll(".quartileBox").data([quartiles]);

        quartileBox.enter()
            .append("rect")
            .attr("class", "quartileBox")
            .merge(quartileBox)
            .transition() // Start a transition to update the quartile box
            .duration(1000) // Duration of 1 second for the transition
            .attr("x", lowerQuartileX) // Update the x position
            .attr("width", upperQuartileX - lowerQuartileX) // Update the width
            .attr("y", 0) // Maintain y at the top of the plot
            .attr("height", height) // Maintain the full height of the plot
            .style("fill", "rgba(255, 0, 0, 0.2)"); // Set the fill with translucency


        // Update the bars
        const values = data.values[year];
        const update = svg.selectAll(".bar").data(values);
        const enter = update.enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", (d, i) => x(data.binsX[i]))
                        .attr("width", x(data.binsX[1]) - x(data.binsX[0]) - 1);
        
        update.merge(enter)
            .transition().duration(1000)
            .attr("y", d => y(d))
            .attr("height", d => height - y(d));

        update.exit().remove();

        // Update the year label to display only the year
        yearLabel.text(year).raise();
    }

    // Start the animation with the first year
    animateYears();
});

d3.json('data.json').then(function(data) {
    
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
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
        .attr("x", width / 2) // Position the title in the middle of the svg
        .attr("y", +20) // Position above the chart
        .attr("text-anchor", "middle") // Center the text
        .style("font-size", "20px") // Font size
        .style("fill", "#805a4a") // Font color
        .text(data.title); // Use the title from your data.json

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

    // Add text element for the year in the top left corner
    const yearLabel = svg.append("text")
        .attr("class", "yearLabel")
        .attr("x", 10) // Adjust position from the left margin
        .attr("y", 30) // Adjust position from the top margin
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
        yearLabel.text(year);
    }

    // Start the animation with the first year
    animateYears();
});

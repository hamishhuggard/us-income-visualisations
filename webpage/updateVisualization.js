function updateVisualization(data) {

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

    // Initialize year label
    const yearLabel = svg.append("text")
        .attr("class", "yearLabel")
        .attr("x", 10) // Adjust position from the left margin
        .attr("y", 40) // Adjust position from the top margin
        .attr("text-anchor", "start")
        .text(data.years[0]);

    let currentYearIndex = 0;

    // Initialize bars
    let values = data.values[data.years[0]];
    svg.selectAll(".bar")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(data.binsX[i]))
        .attr("width", x(data.binsX[1]) - x(data.binsX[0]) - 1)
        .attr("y", d => y(d))
        .attr("height", d => height - y(d));


    function animateYears() {

        const increment = parseInt(document.getElementById('incrementSelect').value, 10);
            
        setTimeout(initialiseQuartileBox, 1000);
        setTimeout(drawLine, 2000);
        setTimeout(firstYearLabel, 3000);

        let j=4;
        for (let i=0; i<data.years.length; i=i+increment) {
            setTimeout(() => updatePlot(i), j*1000);
            j++;
        }

        // Optionally reset to start for looping
        //setTimeout(animateYears, 5000+(i+5)*1000);

    }

    function initialiseQuartileBox() {

        const quartiles = data.quartiles[0];
        const lowerQuartileX = x(quartiles[0]);
        const upperQuartileX = x(quartiles[1]);
        const middleQuartileX = (lowerQuartileX + upperQuartileX) / 2;

        // initialise quartile box
        svg.selectAll(".quartileBox")
            .data([0])
            .enter()
            .append("rect")
            .attr("class", "quartileBox")
            .attr("y", 0)
            .attr("height", height)
            .attr("x", lowerQuartileX)
            .attr("width", upperQuartileX - lowerQuartileX)
            .style('opacity', '0.0')
            .transition()
            .duration(1000)
            .style('opacity', '0.8');

        // initialise "middle income" label
        svg.selectAll(".middleIncomeLabel")
            .data([0])
            .enter()
            .append("text")
            .attr("class", "middleIncomeLabel")
            .attr("x", middleQuartileX)
            .attr("y", +20)
            .attr("text-anchor", "middle")
            .text("middle income")
            .style('opacity', '0.0')
            .transition()
            .duration(1000)
            .style('opacity', '0.8');
    }



    function drawLine() {

        const lineData = values.map((val, index) => {
            const bins = data.binsX;
            const xOffset = (bins[1]-bins[0])/2;
            return { x: x(bins[index]+xOffset), y: y(val) };
        });

        // Create a line generator
        const line = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        // Remove existing line to redraw
        svg.selectAll(".dataLine").remove();

        // Append the new line
        const path = svg.append("path")
            .datum(lineData)
            .attr("class", "dataLine")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Calculate the length of the line
        const totalLength = path.node().getTotalLength();

        // Set the dash array and dash offset to the total length, then transition
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000) // Adjust duration to control the speed of the animation
            .attr("stroke-dashoffset", 0);

    }

    function firstYearLabel() {
        svg.append("text")
            .attr("class", "firstYearLabel")
            .attr("x", 10)
            .attr("y", y(values[1])-10)
            .attr("text-anchor", "start")
            .text(data.years[0])
            .style('opacity', '0.0')
            .transition()
            .duration(1000)
            .style('opacity', '0.8');
    }

    function updatePlot(currentYearIndex) {

        const year = data.years[currentYearIndex];

        // Update quartile box
        quartiles = data.quartiles[currentYearIndex];
        lowerQuartileX = x(quartiles[0]);
        upperQuartileX = x(quartiles[1]);

        svg.selectAll(".quartileBox")
            .transition() // Start a transition to update the quartile box
            .duration(1000) // Duration of 1 second for the transition
            .attr("x", lowerQuartileX) // Update the x position
            .attr("width", upperQuartileX - lowerQuartileX) // Update the width

        // Update 'middle income' label
        middleQuartileX = (lowerQuartileX + upperQuartileX) / 2;
        svg.selectAll(".middleIncomeLabel")
            .transition()
            .duration(1000)
            .attr("x", middleQuartileX)

        // Update bars
        values = data.values[year];
        svg.selectAll(".bar")
            .data(values)
            .transition()
            .duration(1000)
            .attr("y", d => y(d))
            .attr("height", d => height - y(d));

        // Update year label
        yearLabel.text(year);


    }

    // Start the animation with the first year
    animateYears();

};

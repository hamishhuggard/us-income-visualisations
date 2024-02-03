d3.json('data.json').then(function(data) {
    console.log(data);
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

    const xAxis = d3.axisBottom(x)
        .tickValues(data.labelsX)
        .tickFormat(function(d, i) { return data.labels[i]; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    // Populate dropdown
    const select = d3.select("#yearSelect")
        .on("change", function() {
            updatePlot(this.value);
        });

    select.selectAll("option")
        .data(data.years)
      .enter().append("option")
        .text(function(d) { return d; });

    function updatePlot(year) {
        const values = data.values[year];
        const bars = svg.selectAll(".bar")
            .data(values);

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return x(data.binsX[i]); })
            .attr("width", x(data.binsX[1]) - x(data.binsX[0]) - 1)
          .merge(bars)
            .transition()
            .duration(1000)
            .attr("y", function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); });

        bars.exit().remove();

        d3.select("#plotTitle").text("Distribution for Year: " + year);
    }

    // Initially load the plot for the first year
    updatePlot(data.years[0]);
});

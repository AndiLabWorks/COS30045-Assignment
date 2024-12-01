// Set the margins and dimensions for the chart
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container for the line chart
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Function to render the line chart based on the selected region
function renderLineChart(region) {
  // Clear previous chart elements
  svg.selectAll("*").remove();

  // Set up scales
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  // Load the data from CSV
  d3.csv("year.csv", function (d) {
    // Parse the data: convert the year and pollutant values to numbers
    d.Year = +d.Year;
    d[region] = +d[region]; // Use dynamic region key
    return d;
  }).then(function (data) {
    // Set the x scale domain to the years from the data
    x.domain(
      d3.extent(data, function (d) {
        return d.Year;
      })
    );

    // Set the y scale domain based on the region data
    y.domain([
      0,
      d3.max(data, function (d) {
        return d[region];
      }),
    ]).nice();

    // Line generator function
    const line = d3
      .line()
      .x(function (d) {
        return x(d.Year);
      })
      .y(function (d) {
        return y(d[region]);
      });

    // Append the line for the chart
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    // Append X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Append Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Add labels
    svg
      .append("text")
      .attr("transform", `translate(${width / 2},${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -(height / 2))
      .style("text-anchor", "middle")
      .text("PM2.5 Concentration (µg/m³)");
  });
}

// Initialize Line Chart with Northern Malaysia data
renderLineChart("Northern Malaysia (µg/m³)");

// Event Listeners for Buttons to Update the Chart
document.getElementById("northernBtn").addEventListener("click", function () {
  renderLineChart("Northern Malaysia (µg/m³)");
});

document.getElementById("centralBtn").addEventListener("click", function () {
  renderLineChart("Central Malaysia (µg/m³)");
});

document.getElementById("southernBtn").addEventListener("click", function () {
  renderLineChart("Southern Malaysia (µg/m³)");
});

document.getElementById("eastBtn").addEventListener("click", function () {
  renderLineChart("East Malaysia (µg/m³)");
});

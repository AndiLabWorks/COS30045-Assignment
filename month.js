// Set the margins and dimensions for the chart
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container for the area chart
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Mapping of pollutant to button colors
const pollutantColors = {
  CO: "#3b82f6", // Blue (matches CO button)
  NOx: "#22c55e", // Green (matches NOx button)
  PM10: "#a855f7", // Purple (matches PM10 button)
};

// Function to render the stacked area chart based on the selected pollutant
function renderStackedAreaChart(pollutant) {
  // Clear previous chart elements
  svg.selectAll("*").remove();

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Set up scales
  const x = d3.scaleBand().range([0, chartWidth]).padding(0.1); // Will set the domain later after loading the data
  const y = d3.scaleLinear().range([chartHeight, 0]);

  // Create the chart group
  const g = svg.append("g");

  // Load the data from CSV and update the chart
  d3.csv("month.csv", function (d) {
    d.value = +d.value; // Parse value as number
    return d;
  }).then(function (data) {
    // Filter data for the selected pollutant
    const filteredData = data.filter((d) => d.pollutant === pollutant);

    // Group data by month and calculate cumulative values
    const groupedData = d3.group(filteredData, (d) => d.month);

    const processedData = Array.from(groupedData, ([month, values]) => {
      return {
        month,
        value: d3.sum(values, (d) => d.value), // Sum values for stacking
      };
    });

    // Set the x and y scale domains
    x.domain(processedData.map((d) => d.month));
    y.domain([0, d3.max(processedData, (d) => d.value)]).nice();

    // Area generator function
    const area = d3
      .area()
      .x((d) => x(d.month) + x.bandwidth() / 2) // Center x-coordinate in the band
      .y0(chartHeight) // Start area baseline at bottom
      .y1((d) => y(d.value)); // Height of area based on value

    // Append the area path with transitions
    g.append("path")
      .data([processedData])
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", pollutantColors[pollutant]) // Set the fill color dynamically
      .attr("opacity", 0.8)
      .transition() // Transition for smooth rendering
      .duration(1000)
      .ease(d3.easeCubicInOut);

    // Create the X-axis with transition
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut);

    // Create the Y-axis with transition
    g.append("g")
      .call(d3.axisLeft(y))
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut);
  });
}

// Initialize chart with CO data
renderStackedAreaChart("CO");

// Event Listeners for Button Clicks to Update the Chart
document.getElementById("coButton").addEventListener("click", function () {
  renderStackedAreaChart("CO");
});

document.getElementById("noxButton").addEventListener("click", function () {
  renderStackedAreaChart("NOx");
});

document.getElementById("pm10Button").addEventListener("click", function () {
  renderStackedAreaChart("PM10");
});

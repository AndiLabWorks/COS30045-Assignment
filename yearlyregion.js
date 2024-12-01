// Load the CSV file and set up the chart
d3.csv("yearlyregion.csv").then(function (data) {
  // Parse the data to correct formats
  data.forEach(function (d) {
    d.Year = +d.Year; // Convert Year to number
    d.CO = +d.CO; // Convert CO data to number
    d.NOx = +d.NOx; // Convert NOx data to number
    d.PM10 = +d.PM10; // Convert PM10 data to number
  });

  // Initialize the chart dimensions
  var margin = { top: 20, right: 30, bottom: 40, left: 40 };
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // Create the SVG container for the chart
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set up the scales for the X and Y axes
  var x = d3.scaleLinear().range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  // Set up the line generator
  var line = d3
    .line()
    .x(function (d) {
      return x(d.Year);
    })
    .y(function (d) {
      return y(d.value);
    });

  // Initially load the chart with Northern Peninsular Region and CO
  updateChart("Northern Peninsular Region", "CO");

  // Function to update the chart based on region and pollutant
  function updateChart(region, pollutant) {
    // Filter data by region
    var regionData = data.filter(function (d) {
      return d.Region === region;
    });

    // Extract the necessary values for the selected pollutant
    var pollutantData = regionData.map(function (d) {
      return { Year: d.Year, value: d[pollutant] };
    });

    // Update the domains for the scales based on the data
    x.domain([
      d3.min(pollutantData, function (d) {
        return d.Year;
      }),
      d3.max(pollutantData, function (d) {
        return d.Year;
      }),
    ]);
    y.domain([
      d3.min(pollutantData, function (d) {
        return d.value;
      }),
      d3.max(pollutantData, function (d) {
        return d.value;
      }),
    ]);

    // Remove any existing lines
    svg.selectAll("*").remove();

    // Add the X axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Add the line for the selected pollutant
    svg
      .append("path")
      .data([pollutantData])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }

  // Set up the event listeners for the region buttons
  d3.select("#northernBtn").on("click", function () {
    updateChart("Northern Peninsular Region", "CO");
    d3.select("#currentSelection").text(
      "Viewing: Northern Peninsular Region - CO"
    );
  });

  d3.select("#centralBtn").on("click", function () {
    updateChart("Central Peninsular Region", "CO");
    d3.select("#currentSelection").text(
      "Viewing: Central Peninsular Region - CO"
    );
  });

  d3.select("#easternBtn").on("click", function () {
    updateChart("Eastern Peninsular Region", "CO");
    d3.select("#currentSelection").text(
      "Viewing: Eastern Peninsular Region - CO"
    );
  });

  d3.select("#southernBtn").on("click", function () {
    updateChart("Southern Peninsular Region", "CO");
    d3.select("#currentSelection").text(
      "Viewing: Southern Peninsular Region - CO"
    );
  });

  d3.select("#borneoBtn").on("click", function () {
    updateChart("Malaysian Borneo Region", "CO");
    d3.select("#currentSelection").text(
      "Viewing: Malaysian Borneo Region - CO"
    );
  });

  // Set up the event listeners for the pollutant buttons
  d3.select("#coBtn").on("click", function () {
    var currentRegion = d3
      .select("#currentSelection")
      .text()
      .split(" - ")[0]
      .split(": ")[1];
    updateChart(currentRegion, "CO");
    d3.select("#currentSelection").text("Viewing: " + currentRegion + " - CO");
  });

  d3.select("#noxBtn").on("click", function () {
    var currentRegion = d3
      .select("#currentSelection")
      .text()
      .split(" - ")[0]
      .split(": ")[1];
    updateChart(currentRegion, "NOx");
    d3.select("#currentSelection").text("Viewing: " + currentRegion + " - NOx");
  });

  d3.select("#pm10Btn").on("click", function () {
    var currentRegion = d3
      .select("#currentSelection")
      .text()
      .split(" - ")[0]
      .split(": ")[1];
    updateChart(currentRegion, "PM10");
    d3.select("#currentSelection").text(
      "Viewing: " + currentRegion + " - PM10"
    );
  });
});

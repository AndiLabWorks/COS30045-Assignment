// Declare a global variable to track the selected pollutant
let selectedPollutant = "CO";

function init() {
  // Select the map container and get its dimensions
  var container = d3.select("#map");
  var w = container.node().getBoundingClientRect().width;
  var h = container.node().getBoundingClientRect().height;

  // Define a color scale (updated dynamically based on pollutant values)
  var color = d3.scaleQuantize();

  // Create a Mercator projection centered on Malaysia
  var projection = d3
    .geoMercator()
    .center([109.5, 4]) // Center Malaysia
    .translate([w / 2, h / 2])
    .scale(2500);

  // Create a path generator using the projection
  var path = d3.geoPath().projection(projection);

  // Append an SVG element to the #map container
  var svg = container.append("svg").attr("width", w).attr("height", h);

  // Load GeoJSON data for Malaysia (optional, depends on your setup)
  d3.json("location.geojson").then(function (json) {
    // Add paths for each region in the GeoJSON
    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#E5E7EB")
      .attr("stroke", "#000");
  });

  // Create a tooltip element (hidden by default)
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "#fff")
    .style("border", "1px solid #000")
    .style("padding", "5px")
    .style("border-radius", "4px")
    .style("font-size", "12px");

  // Load data and render circles for cities
  Promise.all([d3.csv("malaysiacity.csv"), d3.csv("pollutant.csv")]).then(
    function ([locations, pollutants]) {
      // Merge pollutants data with locations
      var pollutantData = {};
      pollutants.forEach(function (d) {
        if (!pollutantData[d.location]) pollutantData[d.location] = {};
        pollutantData[d.location][d.pollutant] = +d.value;
      });

      // Create city circles on the map
      var circles = svg
        .selectAll("circle")
        .data(locations)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([+d.lon, +d.lat])[0])
        .attr("cy", (d) => projection([+d.lon, +d.lat])[1])
        .attr("r", 5)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5);

      // Function to update circle colors based on pollutant type
      function updateCircles(pollutant) {
        // Get values for the selected pollutant and update color scale
        var values = Object.values(pollutantData).map((d) => d[pollutant]);
        color
          .domain([d3.min(values), d3.max(values)])
          .range(["#f2f0f7", "#cbc9e2", "#9e9ac8", "#756bb1", "#54278f"]);

        // Update circle colors
        circles
          .transition()
          .duration(500)
          .attr("fill", function (d) {
            return pollutantData[d.location] &&
              pollutantData[d.location][pollutant]
              ? color(pollutantData[d.location][pollutant])
              : "#ccc"; // Default for missing data
          });
      }

      // Add hover functionality on circles to display name and pollutant value
      circles
        .on("mouseover", function (event, d) {
          // Get the pollutant value for the hovered location
          var value = pollutantData[d.location]
            ? pollutantData[d.location][selectedPollutant]
            : "N/A";

          // Show the tooltip with the location name and value
          tooltip
            .style("visibility", "visible")
            .html(`${d.location}: ${value} µg/m³`) // Display location and value
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px");
        })
        .on("mousemove", function (event) {
          // Move the tooltip with the cursor
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", function () {
          // Hide the tooltip when the mouse leaves the circle
          tooltip.style("visibility", "hidden");
        });

      // Add event listeners for buttons to update circles based on pollutant type
      d3.select("#btn-co").on("click", function () {
        selectedPollutant = "CO";
        updateCircles("CO");
      });
      d3.select("#btn-nox").on("click", function () {
        selectedPollutant = "NOx";
        updateCircles("NOx");
      });
      d3.select("#btn-pm10").on("click", function () {
        selectedPollutant = "PM10";
        updateCircles("PM10");
      });

      // Initialize the circles with CO data
      updateCircles("CO");
    }
  );
}

window.onload = init;

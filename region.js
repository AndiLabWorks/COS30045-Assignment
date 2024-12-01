// Configuration
const chartWidth = 600;
const chartHeight = 400;
const margin = { top: 20, right: 20, bottom: 50, left: 60 };

// Create SVG
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight);

const chartGroup = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3
  .scaleBand()
  .range([0, chartWidth - margin.left - margin.right])
  .padding(0.2);

const yScale = d3
  .scaleLinear()
  .range([chartHeight - margin.top - margin.bottom, 0]);

const xAxisGroup = chartGroup
  .append("g")
  .attr(
    "transform",
    "translate(0," + (chartHeight - margin.top - margin.bottom) + ")"
  );

const yAxisGroup = chartGroup.append("g");

// Load CSV Data
d3.csv("region.csv").then(function (data) {
  // Parse data
  data.forEach(function (d) {
    d.value = +d.value;
  });

  // Filter data by pollutant type
  const filterData = function (pollutant) {
    return data.filter(function (d) {
      return d.pollutant === pollutant;
    });
  };

  const updateChart = function (filteredData, label, color) {
    // Update scales
    xScale.domain(
      filteredData.map(function (d) {
        return d.region;
      })
    );
    yScale.domain([
      0,
      d3.max(filteredData, function (d) {
        return d.value;
      }),
    ]);

    // Bind data to bars
    const bars = chartGroup.selectAll(".bar").data(filteredData, function (d) {
      return d.region;
    });

    // Enter new bars
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return xScale(d.region);
      })
      .attr("y", yScale(0))
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", color)
      .transition()
      .duration(800)
      .attr("y", function (d) {
        return yScale(d.value);
      })
      .attr("height", function (d) {
        return chartHeight - margin.top - margin.bottom - yScale(d.value);
      });

    // Update existing bars
    bars
      .transition()
      .duration(800)
      .attr("x", function (d) {
        return xScale(d.region);
      })
      .attr("y", function (d) {
        return yScale(d.value);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return chartHeight - margin.top - margin.bottom - yScale(d.value);
      })
      .attr("fill", color);

    // Remove old bars
    bars
      .exit()
      .transition()
      .duration(800)
      .attr("y", yScale(0))
      .attr("height", 0)
      .remove();

    // Update axes
    xAxisGroup.transition().duration(800).call(d3.axisBottom(xScale));

    yAxisGroup.transition().duration(800).call(d3.axisLeft(yScale).ticks(5));

    // Update labels
    svg.select(".x-label").remove();
    svg.select(".y-label").remove();

    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight - 10)
      .text("Regions");

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -(chartHeight / 2))
      .attr("y", 20)
      .text(label);
  };

  // Initial chart
  updateChart(filterData("CO"), "CO (mg/m³)", "steelblue");

  // Button listeners
  document.getElementById("btnCO").addEventListener("click", function () {
    updateChart(filterData("CO"), "CO (mg/m³)", "steelblue");
  });

  document.getElementById("btnNOx").addEventListener("click", function () {
    updateChart(filterData("NOx"), "NOx (ppm)", "green");
  });

  document.getElementById("btnPM10").addEventListener("click", function () {
    updateChart(filterData("PM10"), "PM10 (µg/m³)", "purple");
  });
});

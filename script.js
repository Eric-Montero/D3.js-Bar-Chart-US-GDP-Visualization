const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const svg = d3.select("svg");
const width = 960;
const height = 500;
const padding = 60;

const tooltip = d3.select("#tooltip");

d3.json(url).then(data => {
  const dataset = data.data;
  const dates = dataset.map(d => new Date(d[0]));
  const gdps = dataset.map(d => d[1]);

  const xScale = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(gdps)])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  const barWidth = (width - 2 * padding) / dataset.length;

  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", d => height - padding - yScale(d[1]))
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 0.9)
        .html(`${d[0]}<br>$${d[1]} Billion`)
        .attr("data-date", d[0])
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });
});

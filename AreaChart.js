//Resusable Chart Template
// input: selector for a chart container e.g., ".chart"
//AreaChart can be called to create area charts, and update data can be called to update underlying data
// initialization
// input: selector for a chart container e.g., ".chart"
export default function AreaChart(container){
    const listeners = { brushed: null };
    let outerWidth = 700;
    let outerHeight = 200;
    let margin = {top:40, right:40, bottom: 40, left: 40}; //create margin between axis and outside of chart
    let width = outerWidth - margin.left - margin.right, height = outerHeight - margin.top - margin.bottom;

    let svg = d3.select(container).append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .append("g")

 const xScale = d3.scaleTime()
            .rangeRound([0, width])    
        
const yScale = d3.scaleLinear()
            .range([height, 0]); //height goes first because the browser considers origin (0,0) to be upper left corner

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().ticks(3).scale(yScale);
    
const x_axis = svg.append("g").attr("class", "axis x-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top + height - 40})`)
    .call(xAxis);

    const y_axis = svg.append("g").attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top  -40})`)
        .call(yAxis);

    const brush = d3.brushX()
    .extent([
      [margin.left, margin.top - 40],
      [width + margin.left, height + margin.top - 40],
    ])
    .on("brush", brushed);

svg.append("g").attr("class", "brush").call(brush);

	function update(data){ 

        xScale.domain(d3.extent(data, d=>d.date));
        yScale.domain([0, d3.max(data, d=>d.total)]);

        const area = d3.area()
            .x(d=>xScale(d.date) + 40)
            .y0(yScale(0))
            .y1(d=>yScale(d.total))

        svg.append("path")
        .attr('class', 'area')
        .attr('fill', 'teal')
        .datum(data)
        .attr("d", area)
        
        x_axis.call(xAxis);
        y_axis.call(yAxis);
    }
    
    function on(event, listener) {
        listeners[event] = listener;
    }
    function brushed(event) {
        if (event.selection) {
            console.log("brushed", event.selection)
        event.selection.map((d) => d - margin.left);
        listeners["brushed"](event.selection.map(xScale.invert))
        }
    }
	return {
        update, // ES6 shorthand for "update": update
        on,
	};
}

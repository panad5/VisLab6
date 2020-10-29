export default function StackedAreaChart(container) {
    let selected = null, xDomain, data;
    let outerWidth = 700;
    let outerHeight = 500;
    let margin = {top:40, right:40, bottom: 40, left: 40}; //create margin between axis and outside of chart
    let width = outerWidth - margin.left - margin.right, height = outerHeight - margin.top - margin.bottom;

    let svg = d3.select(container).append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
        .scaleTime()
        .range([0,width])
    
    const yScale = d3
        .scaleLinear()
        .range([height,0])
    
    const colors = d3.scaleOrdinal()
        .range(d3.schemeTableau10);
    
    const xAxis = d3.axisBottom()
        .scale(xScale);
    
    const yAxis = d3.axisLeft()
        .scale(yScale);

    var xaxis = svg.append("g")
        .attr('class', 'axis x-axis');

    var yaxis = svg.append('g')
        .attr('class', 'axis y-axis');

    const tooltip = svg
        .append("text")
        .attr('x', 0)
        .attr('y', -10)
        .attr('font-size', 10);

        svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)// the size of clip-path is the same as
    .attr("height", height); // the chart area

	function update(data){
        var keys = selected? [selected]: data.columns.slice(1,-1);
        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        var series = stack(data);
        colors.domain(keys);

        xScale.domain(xDomain ? xDomain : d3.extent(data, d => d.date))
        yScale.domain([0, d3.max(series, a => d3.max(a, d=>d[1])) 
        ]);

        const area = d3.area()
            .x(d=>xScale(d.data.date))
            .y0(d=>yScale(d[0]))
            .y1(d=>yScale(d[1]));
        
        const areas = svg.selectAll(".area")
            .data(series, d => d.key);
        
        areas.enter()
            .append("path")
            .attr("clip-path", "url(#chart-area)")
            .attr("class", "area")
            .attr("id", function(d) { return d.key })
            .style("fill", function(d) { return colors(d.key); })
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(''))
            .on("click", (event, d) => {
                if (selected === d.key) {
                selected = null;
                } else {
                    selected = d.key;
                }
                update(data);
            })
            .merge(areas)
            .attr("d", area);
        areas.exit().remove();
        
        xaxis.call(xAxis)
            .attr("transform", `translate(0, ${height})`);

        yaxis.call(yAxis);
    }
    
    function filterByDate(range){
		xDomain = range;
		update(data);
    }
    
	return {
        update,
        filterByDate
	}
};

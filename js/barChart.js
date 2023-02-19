class Barchart {
	/**
	 * Class constructor with basic chart configuration
	 */
	constructor(_config, _data, _column, _columnname, _title) {
	  // Configuration object with defaults
	  this.config = {
		parentElement: _config.parentElement,
		colorScale: _config.colorScale,
		containerWidth: _config.containerWidth || 260,
		containerHeight: _config.containerHeight || 300,
		margin: _config.margin || {top: 25, right: 20, bottom: 20, left: 40},
	  }
	  this.data = _data;
	  this.column = _column;
	  this.columnname = _columnname;
	  this.title = _title;
	  this.initVis();
	}
	
	/**
	 * Initialize scales/axes and append static elements, such as axis titles
	 */
	initVis() {
	  let vis = this;
  
	  // Calculate inner chart size. Margin specifies the space around the actual chart.
	  vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
	  vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
	  // Initialize scales and axes
	  
	  // Initialize scales
	  vis.colorScale = d3.scaleOrdinal()
		  .range(this.config.colorScale.range())
		  .domain(this.config.colorScale.domain());
	  
	  // Important: we flip array elements in the y output range to position the rectangles correctly
	  vis.yScale = d3.scaleLinear()
		  .range([vis.height, 0]) 
  
	  vis.xScale = d3.scaleBand()
		  .range([0, vis.width])
		  .paddingInner(0.2);
  
	  vis.xAxis = d3.axisBottom(vis.xScale)
		  .ticks(this.config.colorScale.domain())
		  .tickSizeOuter(0);
  
	  vis.yAxis = d3.axisLeft(vis.yScale)
		  .ticks(6)
		  .tickSizeOuter(0)
  
	  // Define size of SVG drawing area
	  vis.svg = d3.select(vis.config.parentElement)
		  .attr('width', vis.config.containerWidth)
		  .attr('height', vis.config.containerHeight);
  
	  // SVG Group containing the actual chart; D3 margin convention
	  vis.chart = vis.svg.append('g')
		  .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
	  // Append empty x-axis group and move it to the bottom of the chart
	  vis.xAxisG = vis.chart.append('g')
		  .attr('class', 'axis x-axis')
		  .attr('transform', `translate(0,${vis.height})`);
	  
	  // Append y-axis group 
	  vis.yAxisG = vis.chart.append('g')
		  .attr('class', 'axis y-axis');
  
	  // Append axis title
	  vis.svg.append('text')
		  .attr('class', 'axis-title')
		  .attr('x', 0)
		  .attr('y', 0)
		  .attr('dy', '.71em')
		  .text(this.columnname);
	}
  
	/**
	 * Prepare data and scales before we render it
	 */
	updateVis() {
	  let vis = this;
  
	  // Prepare data: count number of trails in each difficulty category
	  // i.e. [{ key: 'easy', count: 10 }, {key: 'intermediate', ...
	  const aggregatedDataMap = d3.rollups(vis.data, v => v.length, d => d[this.column]);
	  vis.aggregatedData = Array.from(aggregatedDataMap, ([key, count]) => ({ key, count }));
  
	  const orderedKeys = this.config.colorScale.domain();
	  vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
		return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
	  });
  
	  // Specificy accessor functions
	  vis.colorValue = d => d.key;
	  vis.xValue = d => d.key;
	  vis.yValue = d => d.count;
  
	  // Set the scale input domains
	  vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
	  vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);
  
	  vis.renderVis();
	}
  
	/**
	 * Bind data to visual elements
	 */
	renderVis() {
	  let vis = this;
  
	  // Add rectangles
	  const bars = vis.chart.selectAll('.bar')
		  .data(vis.aggregatedData, vis.xValue)
		.join('rect')
		  .attr('class', 'bar')
		  .attr('x', d => vis.xScale(vis.xValue(d)))
		  .attr('width', vis.xScale.bandwidth())
		  .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
		  .attr('y', d => vis.yScale(vis.yValue(d)))
		  .attr('fill', d => vis.colorScale(vis.colorValue(d)))
  
	  // Update axes
	  vis.xAxisG.call(vis.xAxis);
	  vis.yAxisG.call(vis.yAxis);
	}
  }
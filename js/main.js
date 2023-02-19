let data, sysStar;

/*
 *  Load data from CSV file
 */
d3.csv('data/exoplanets-1.csv')
	.then(_data => {
		//data.forEach(d => {
        // 
		// });
        data = _data;
        console.log('Data loaded');
	})
 	.catch(error => {
  		console.error(error);
	});

    const starScale = d3.scaleOrdinal()
    .domain(['1', '2', '3', '4'])
    // https://www.color-hex.com/color-palette/29137
    .range(['#961890', '#00508c', '#750884', '#00576d']);
    //Number of stars in the system
    sysStar = new Barchart({
        'parentElement': '#barChart1',
        'colorScale' : starScale,
        'containerHeight': 200,
        'containerWidth': 600,
    }, data, 'sy_snum', "Stars per system", 'Number of Stars'); 
        sysStar.updateVis();
let data, numStars, numPlanets, starType, discoveryMethod, habitability, histogram, discYearArray, discoveryTime, scatterplot;
let filter = [];

/*
 *  Load data from CSV file
 */
d3.csv('data/exoplanets-1.csv')
	.then(_data => {
        data = _data;

        // Bar chart #1: Number of exoplanets that are from systems with 1 star, 2 stars, 3 stars, etc.
        const colorScale1 = d3.scaleOrdinal()
        .domain(['1', '2', '3', '4'])
        .range(['#6497b1', '#6497b1', '#6497b1', '#6497b1']);

        numStars = new BarChart({
        'parentElement': '#barChart1',
        'colorScale' : colorScale1,
        'containerHeight': 200,
        'containerWidth': 400,
        }, data, 'sy_snum', "Stars per system", false); 
        numStars.updateVis();

        // Bar chart #2: Number of exoplanets that are from systems with 1 planets, 2 planets, 3 planets, etc.
        const colorScale2 = d3.scaleOrdinal()
        .domain(['1', '2', '3', '4', '5', '6', '7', '8'])
        .range(['#146eb4', '#146eb4', '#146eb4', '#146eb4', '#146eb4', '#146eb4', '#146eb4', '#146eb4']);

        numPlanets = new BarChart({
                'parentElement': '#barChart2',
                'colorScale' : colorScale2,
                'containerHeight': 200,
                'containerWidth': 400,
                }, data, 'sy_pnum', "Planets per system", false); 
                numPlanets.updateVis();

        // Bar chart #3: Number of exoplanets that orbit stars of different types
        // Get the first initial for the type of star each exoplanet orbits
        data.forEach( d => {
		let starType = d.st_spectype;
		if (starType.charAt(0).toUpperCase() == "A" || starType.charAt(0).toUpperCase() == "F" || starType.charAt(0).toUpperCase() == "G" || starType.charAt(0).toUpperCase() == "K" || starType.charAt(0).toUpperCase() == "M"){
			d ['starTypeInitial'] = starType.charAt(0).toUpperCase();
		} else {
			d ['starTypeInitial'] = "Unknown";
		}
        });

        const colorScale3 = d3.scaleOrdinal()
        .domain(['A', 'F', 'G', 'K', 'M', 'Unknown'])
        .range(['#002790', '#002790', '#002790', '#002790', '#002790', '#002790']);

        starType = new BarChart({
                'parentElement': '#barChart3',
                'colorScale' : colorScale3,
                'containerHeight': 200,
                'containerWidth': 400,
                }, data, 'starTypeInitial', "Type of star", false); 
                starType.updateVis();

        // Bar chart #4: Number of exoplanets that were discovered by different methods
        const colorScale4 = d3.scaleOrdinal()
        .domain(['Astrometry', 'Disk Kinematics', 'Eclipse Timing Variations', 'Imaging', 'Microlensing', 'Orbital Brightness Modulation', 'Pulsar Timing', 'Pulsation Timing Variations', 'Radial Velocity', 'Transit', 'Transit Timing Variations'])
        .range(['#02577a', '#02577a', '#02577a', '#02577a', '#02577a', '#02577a', '#02577a', '#02577a', '#02577a', '#02577a', '#02577a']);

        discoveryMethod = new BarChart({
                'parentElement': '#barChart4',
                'colorScale' : colorScale4,
                'containerHeight': 200,
                'containerWidth': 800,
                }, data, 'discoverymethod', "Method of discovery", true); 
                discoveryMethod.updateVis();

        // Bar chart #5: Number of exoplanets that are within a habitable zone vs outside the habitable zone
        // Determine which exoplanets are habitable or uninhabitable using both the distance between the star and the planet and the type of star
        data.forEach(d => {
		if (d.starTypeInitial == 'A'){
			if (d.pl_orbsmax >= 8.5 && d.pl_orbsmax <= 12.5){
				d ['exoplanetHabitability'] = 'Habitable';
			} else{
				d ['exoplanetHabitability'] = 'Uninhabitable';
			}
		} else if (d.starTypeInitial == 'F'){
			if (d.pl_orbsmax >= 1.5 && d.pl_orbsmax <= 2.2){
				d ['exoplanetHabitability'] = 'Habitable';
			} else{
				d ['exoplanetHabitability'] = 'Uninhabitable';
			}
		} else if (d.starTypeInitial == 'G'){
			if (d.pl_orbsmax >= 0.95 && d.pl_orbsmax <= 1.4){
				d ['exoplanetHabitability'] = 'Habitable';
			} else{
				d ['exoplanetHabitability'] = 'Uninhabitable';
			}
		} else if (d.starTypeInitial == 'K'){
			if (d.pl_orbsmax >= 0.38 && d.pl_orbsmax <= 0.56){
				d ['exoplanetHabitability'] = 'Habitable';
			} else{
				d ['exoplanetHabitability'] = 'Uninhabitable';
			}
		} else if (d.starTypeInitial == 'M'){
			if (d.pl_orbsmax >= 0.08 && d.pl_orbsmax <= 0.12){
				d ['exoplanetHabitability'] = 'Habitable';
			} else{
				d ['exoplanetHabitability'] = 'Uninhabitable';
			}
		} else {
			d ['exoplanetHabitability'] = 'Unknown';
		}
	});

        const colorScale5 = d3.scaleOrdinal()
        .domain(['Habitable', 'Uninhabitable', 'Unknown'])
        .range(['#2e4482', '#2e4482', '#2e4482']);

        habitability = new BarChart({
                'parentElement': '#barChart5',
                'colorScale' : colorScale5,
                'containerHeight': 200,
                'containerWidth': 400,
                }, data, 'exoplanetHabitability', "Habitability of exoplanets", false); 
                habitability.updateVis();


        // Histogram: the distribution of exoplanets by their distance to us
        histogram = new Histogram({ parentElement: '#histogram'}, data, 'Distance from Earth');
        histogram.updateVis();

        // Line chart: exoplanet discoveries over time (by year)
        let minYear = d3.min( data, d => d.disc_year);
	let maxYear = d3.max( data, d=> d.disc_year );

	discYearArray = [];
	for(let i = minYear; i < maxYear; i++){

		let oneYear = data.filter( d => d.disc_year == i );
		let total = d3.count(oneYear, d => d.disc_year);
		discYearArray.push( {"year": parseInt(i), "count": total});
	}
        
        discoveryTime = new LineChart({
		'parentElement': '#lineChart',
		'containerHeight': 300,
		'containerWidth': 400,
	}, discYearArray, 'Discoveries each year');
	discoveryTime.updateVis();

        // Scatterplot: shows the relationships between exoplanet radius and mass
        scatterplot = new ScatterPlot({ 
		'parentElement': '#scatterplot',
		'containerHeight': 200,
		'containerWidth': 400,
	  }, data);
	  scatterplot.updateVis();
          
	})
 	.catch(error => {
  		console.error(error);
	});

        function filterData() {
                numStars.data = data;
                numPlanets.data = data;
                starType.data = data;
                habitability.data = data;
                discoveryMethod.data = data;
                let usedForFilter = [];
                filter.forEach (f => {
                        let info = f.split(",");
                        if (!usedForFilter.includes(info[0])){
                                usedForFilter.push (info[0])
                        }
                });
                filter.forEach( f => {
                        let info = f.split(",");
                        if (!usedForFilter.includes("sy_snum")){
                                numStars.data = numStars.data.filter(d => d[info[0]] == info[1]);
                        }
                        if (!usedForFilter.includes("sy_pnum")){
                                numPlanets.data = numPlanets.data.filter(d => d[info[0]] == info[1]);
                        }
                        if (!usedForFilter.includes("tstarTypeInitialype")){
                                starType.data = starType.data.filter(d => d[info[0]] == info[1]);
                        }
                        if (!usedForFilter.includes("exoplanetHabitability")){
                                habitability.data = habitability.data.filter(d => d[info[0]] == info[1]);
                        }
                        if (!usedForFilter.includes("discoverymethod")){
                                discoveryMethod.data = discoveryMethod.data.filter(d => d[info[0]] == info[1]);
                        }
                });
                numStars.updateVis();
                numPlanets.updateVis();
                starType.updateVis();
                habitability.updateVis();
                discoveryMethod.updateVis();
          }
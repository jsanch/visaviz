var MultiViz = {
	// Data
	data: null,
	usChart: null,
	industryChart:null,
	roundChart:null,
	certifiedChart:null,
	jobTitleChart:null,
	dataTableChart:null,
	companiesChart:null,
	dataCounter:null,

	draw: function (_data){
		var numberFormat = d3.format("0");

	    MultiViz.usChart = dc.geoChoroplethChart("#us-chart");
	    MultiViz.industryChart = dc.bubbleChart("#industry-chart");
	    MultiViz.roundChart = dc.bubbleChart("#round-chart");
	    MultiViz.certifiedChart = dc.rowChart('#certified-chart');
 		MultiViz.jobTitleChart = dc.rowChart('#job-title-Chart');
 		MultiViz.companiesChart = dc.barChart('#companies-chart');
 		// MultiViz.dataCounter = dc.dataCount('.dc-data_count');


 		this.data = crossfilter(_data);
 		// var all = this.data.groupAll();
		// MultiViz.dataCounter.dimension(this.data).group(all);

 		//CROSSFILTER DIMENSIONS


	    var year = this.data.dimension(function(d) {return d.year;});
	   	var yearGroup = year.group();



        var states = this.data.dimension(function (d) {return d["workloc1_state"];});
        var countAppliedPerState = states.group().reduceCount();
   
        var employers = this.data.dimension(function(d){ return d["employer_name"]; });
        var statsByEmployers = employers.group().reduce(
            function (p, v) {
            	++p.count;                    // how many people applied ? 
            	p.sum += v["wage_rate_from"]
            	p.average = p.sum / p.count;  // avg Salary earned at this company. 
            	if (v.status == "CERTIFIED") {  
            		p.certified_count += 1;   // how many people Internatinols doe sit currently have a job ? 

            	} 
            	 if (p.certified_count < 0.001) p.certified_count = 0;
                return p;
            },
            function (p, v) {
            	--p.count;
            	p.sum -= v["wage_rate_from"]
            	p.average = p.sum / p.count
            	if (v.status == "CERTIFIED") {
            		p.certified_count -= 1; 
            	} 
            	 if (p.certified_count < 0.001) p.certified_count = 0;
            	return p;
            },
            function () {
                return {count:0, sum: 0, average: 0, certified_count:0 }
            });

		var status = this.data.dimension(function (d) {return d.status; });
		var statusGroup = status.group();

		var job_titles = this.data.dimension(function(d) {return d.job_title});
		var statsByJobTitles = job_titles.group().reduce(
	            function (p, v) {
	            	++p.count;                    // how many people have the same job ? 
	            	p.sum += v["wage_rate_from"]
	            	p.average = p.sum / p.count;  // avg Salary earned at this company. 
	            	if (v.status == "CERTIFIED") {  
	            		p.certified_count += 1;   // how many people Internatinols doe sit currently have a job ? 

	            	} 
	            	 if (p.certified_count < 0.001) p.certified_count = 0;
	                return p;
            },
            	function (p, v) {
	            	--p.count;
	            	p.sum -= v["wage_rate_from"]
	            	p.average = p.sum / p.count
	            	if (v.status == "CERTIFIED") {
	            		p.certified_count -= 1; 
	            	} 
	            	 if (p.certified_count < 0.001) p.certified_count = 0;
	            	return p;
            },
	            function () {
	                return {count:0, sum: 0, average: 0, certified_count:0 }
        });

        var companies = this.data.dimension(function(d) { return d["employer_name"];});
       	var companiesGroup = companies.group();
	
	    // determine a histogram of percent changes
	    var fluctuation = this.data.dimension(function (d) {
	        return Math.round((d.wage_rate_from * 1));
	    });
	    var fluctuationGroup = fluctuation.group();


        var statsByCompanies = companies.group().reduce(
            function (p, v) {
            	++p.count;                    // how many people applied ? 
            	p.sum += v["wage_rate_from"]
            	p.average = p.sum / p.count;  // avg Salary earned at this company. 
            	if (v.status == "CERTIFIED") {  
            		p.certified_count += 1;   // how many people Internatinols doe sit currently have a job ? 

            	} 
            	 if (p.certified_count < 0.001) p.certified_count = 0;
                return p;
            },
            function (p, v) {
            	--p.count;
            	p.sum -= v["wage_rate_from"]
            	p.average = p.sum / p.count
            	if (v.status == "CERTIFIED") {
            		p.certified_count -= 1; 
            	} 
            	 if (p.certified_count < 0.001) p.certified_count = 0;
            	return p;
            },
            function () {
                return {count:0, sum: 0, average: 0, certified_count:0 }
            });




        d3.json("us-states.json", function (statesJson) {
            
        	// CHART 1
            MultiViz.usChart.width(900)
                    .height(500)
                    .dimension(states)
                    .group(countAppliedPerState)
                    .colors(d3.scale.quantize().range(["#CCCCCC", "#B7C4B7", "#A3BCA3", "#8EB58E", "#7AAD7A", "#66A666", "#519E51", "#3D963D", "#288F28", "#148714"]))
                    .colorDomain([0, 200])
                    .colorCalculator(function (d) { return d ? MultiViz.usChart.colors()(d) : '#ccc'; })
                    .overlayGeoJson(statesJson.features, "state", function (d) {
                        return d.properties.name;
                    })
                    .title(function (d) {
                        return "State: " + d.key + "\nTotal Applications For H-1 B Visa: " + numberFormat(d.value ? d.value : 0);
                    });
            
           
            // CHART 2
            MultiViz.industryChart.width(700)
                    .height(250)
                    .margins({top: 10, right: 50, bottom: 30, left: 70})
                    .dimension(employers)
                    .group(statsByEmployers)
                    .colors(d3.scale.category10())
                    .keyAccessor(function (p) {
                        return p.value.count; // x

                    })
                    .valueAccessor(function (p) {
                        return p.value.certified_count; // y
                    })
                    .radiusValueAccessor(function (p) {
                        return p.value.average;
                    })
                    .x(d3.scale.linear().domain([0, 80]))
                    .y(d3.scale.linear().domain([0, 100]))
                    .r(d3.scale.linear().domain([0, 150000]))
                    .minRadiusWithLabel(15)
                    .elasticY(true)
                    .yAxisPadding(50)
                    .elasticX(true)
                    .xAxisPadding(50)
                    .maxBubbleRelativeSize(0.04)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .renderLabel(true)
                    .renderTitle(true)
				 	.yAxisLabel('# of Certified Applications') // (optional) render an axis label below the x axis
				    .xAxisLabel('# of Total Applications') // (optional) render a vertical axis lable left of the y axis
                    .title(function (p) {
                        return p.key
                                + "\n"
                                + "Average Yearly Salary: " + numberFormat(p.value.average)+"\n"
                                +  p.value.count + "Applied";
                    });
            MultiViz.industryChart.yAxis().tickFormat(function (s) {
                return s + "";
            });
            MultiViz.industryChart.xAxis().tickFormat(function (s) {
                return s + "";
            });


            // CHART 3
            MultiViz.certifiedChart.width(180)
         		.height(180)
		        .margins({top: 20, left: 10, right: 10, bottom: 20})
		        .group(statusGroup)
		        .dimension(status)
		        // assign colors to each value in the x scale domain
		        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
		        .label(function (d) {
		            return d.key;
		        })
		        // title sets the row text
		        .title(function (d) {
		            return d.value;
		        })
		        .elasticX(true)
		        .xAxis().ticks(4);


		    // CHART 4

            MultiViz.roundChart.width(1000)
                    .height(500)
                    .margins({top: 10, right: 50, bottom: 30, left: 70})
                    .dimension(job_titles)
                    .group(statsByJobTitles)
                    .colors(d3.scale.category10())
                    .keyAccessor(function (p) {
                        return p.value.count; // x

                    })
                    .valueAccessor(function (p) {
                        return p.value.certified_count; // y
                    })
                    .radiusValueAccessor(function (p) {
                        return p.value.average;
                    })
                    .x(d3.scale.linear().domain([0, 80]))
                    .y(d3.scale.linear().domain([0, 100]))
                    .r(d3.scale.linear().domain([0, 150000]))
                    .minRadiusWithLabel(15)
                    .elasticY(true)
                    .yAxisPadding(50)
                    .elasticX(true)
                    .xAxisPadding(50)
                    .maxBubbleRelativeSize(0.04)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .renderLabel(true)
                    .renderTitle(true)
				 	.yAxisLabel('# of Certified Applications') // (optional) render an axis label below the x axis
				    .xAxisLabel('# of Total Applications') // (optional) render a vertical axis lable left of the y axis
                    .title(function (p) {
                        return p.key
                                + "\n"
                                + "Average Yearly Salary: " + numberFormat(p.value.average) + "M\n"
                                +  p.value.count + "Applied ";
                    });
            MultiViz.roundChart.yAxis().tickFormat(function (s) {
                return s + "";
            });
            MultiViz.roundChart.xAxis().tickFormat(function (s) {
                return s + "";
            });


            // CHART 5
            // Should have top companies. 
		    MultiViz.companiesChart.width(450)
		        .height(250)
		        .margins({top: 10, right: 50, bottom: 30, left: 40})
		        .dimension(fluctuation)
		        .group(fluctuationGroup)
		        .elasticY(true)
		        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
		        .centerBar(true)
		        // (optional) set gap between bars manually in px, :default=2
		        // .gap(1)
		        // (optional) set filter brush rounding
		        .round(dc.round.floor)
		        .alwaysUseRounding(true)
		        .x(d3.scale.linear().domain([0, 100000]))
		        .renderHorizontalGridLines(true)
		        // customize the filter displayed in the control span
		        .filterPrinter(function (filters) {
		            var filter = filters[0], s = '';
		            s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
		            return s;
		        });

		    // Customize axis
		    MultiViz.companiesChart.xAxis().tickFormat(
		        function (v) { return v + '$'; });
		    MultiViz.companiesChart.yAxis().ticks(8);


		    MultiViz.jobTitleChart.width(180)
		        .height(180)
		        .margins({top: 20, left: 10, right: 10, bottom: 20})
		        .group(yearGroup)
		        .dimension(year)
		        // assign colors to each value in the x scale domain
		        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
		        .label(function (d) {
		            return d.key;
		        })
		        // title sets the row text
		        .title(function (d) {
		            return d.value;
		        })
		        .elasticX(true)
		        .xAxis().ticks(4);




		   dc.renderAll();
        });




	     



	
	}
}
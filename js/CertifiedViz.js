var CertifiedViz = {
	// Data
	data: null, 

	// Config
	status_selector: "#status-chart",

	draw: function (_data){
		console.log("hello");
		this.data = _data; 
		console.log(this.data);


	

	var chart = c3.generate({
	    bindto: status_selector,
	    data: {
	      columns: [
	        ['data1', 30, 200, 100, 400, 150, 250],
	        ['data2', 50, 20, 10, 40, 15, 25]
	      ]
	    }
	});



	}
}

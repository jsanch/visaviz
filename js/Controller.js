var Controller = {
	init: function() {

		// Initializing Model And Data
		console.log("--Initializing Model And Data");
		Model.initData(function(data) {
				// Create Vizs
				console.log("--About to draw");
				// CertifiedViz.draw(data);
				MultiViz.draw(data);
			}
		);
		console.log("--Initialized Model");
	}

}
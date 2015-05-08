var Model = {
	
	data:null,
    data2:null,

    initData: function(callback) {

       Model.data = null;
       Model.data2=null;

        var checkMultiLoad = function() {
             // console.log('Multiloading');
            if (Model.data != null)  {
                // console.log('WUUUUUUUUUU');
                callback.call(window, Model.data);
            }
        }
       
        Model.loadData(function(result){
            Model.data = result;
            checkMultiLoad();
        });

        // Model.loadData2(function(result){
        //     Model.data = result;
        //     checkMultiLoad();
        // });


    },


    loadData: function (successCallback) {
        console.log("--Loading data");
		
		d3.csv("data/sample10000.csv")
				 	.row(function(d){ 
                        // console.log(d['year ']);
                        return {'workloc1_state': d.state, 
                                'soc_name': d.occupational_group,
                                'wage_rate_from': parseInt(d.wage),
                                'job_title':d.job_title,
                                'status': d.status,
                                'employer_name': d.employer_name,
                                'year' : d['year ']
                            }
                    })  
					.get(function(error, rows){
						successCallback(rows);
					});

    },
    loadData2: function (successCallback) {
        console.log("--Loading data2");
        
        d3.csv("data/d_2.csv")
                    .row(function(d){ return d })
                    .get(function(error, rows){
                        successCallback(rows);
                    });
    },


    dataLoadError: function(xhr, ajaxOptions, thrownError) {
        console.log(xhr, ajaxOptions, thrownError);
        alert('Could not load data from file.')
    }



}
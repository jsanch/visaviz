var CertifiedViz={data:null,status_selector:"#status-chart",draw:function(t){console.log("hello"),this.data=t,console.log(this.data);var a=c3.generate({bindto:status_selector,data:{columns:[["data1",30,200,100,400,150,250],["data2",50,20,10,40,15,25]]}})}};
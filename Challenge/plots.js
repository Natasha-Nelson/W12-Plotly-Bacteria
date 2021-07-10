function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}

function buildMetadata(sample){
    d3.json("samples.json").then(function(data){

        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(function([key,value]){
            PANEL.append("h6").text(key + ": " + value)
        });
    })
};

// 1. Create the buildCharts function.
function buildCharts(sample){
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then(function(data){

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result1 = resultSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_labels = []
    var otu_ids = [];
    var sample_values = [];


  });
};

function optionChanged(newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts (newSample);
  };

//function buildCharts(){};
  


  init();

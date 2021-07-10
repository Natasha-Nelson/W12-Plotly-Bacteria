function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data)
    
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample = samplesArray.filter(selectedObj => selectedObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = selectedSample[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yTicks = otuIds.slice(0,10).map(i => 'OTU '+ i).reverse()
    console.log(yTicks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yTicks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
  
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:{text: "Top 10 Bacteria Cultures Found",
        font: {size: 24, family: "Arial"}},
      font:{size: 10, family:"Arial"}


     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //Create a bubble chart!

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker:{
        size: sampleValues,
        color: otuIds
      },
      text: otuLabels
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text:"Bacteria Cultures Per Sample", font:{size: 24, family:"Arial"}},
      xaxis: {title: "OTU ID"},
      font: {size: 10, family:"Arial"}
    
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    // Create the gauge chart

    // Create a variable to hold the metadata array 
    var metadata = data.metadata 

    // Filter the data for the object with the desired sample number
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var washer = metaArray[0];
    
    // Access the wash frquency 
    var washFrequency = parseFloat(washer.wfreq);
    console.log(washFrequency);

    // Create the wash frequency data object

    var washData = [{
      value: washFrequency,
      type: "indicator",
      mode: "gauge+number",
      gauge: { 
        axis: { range: [null, 10], tickWidth:1 },
        bar: {color: "black"},
        steps: [
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "green"},
          {range: [8,10], color: "blue"}
        ]
      },
      title:{ text:"Scrubs Per Week" },
    }];

    var washLayout = {
      title: {text: "Belly Button Washing Frequency", 
        font:{family:"Arial", size: 24}},
      width: 550,
      height: 450,
      font:{ family:"Arial", size: 18}

    };

    // Plot the chart
  
    Plotly.newPlot("gauge", washData, washLayout);

    
    
  });
  
}
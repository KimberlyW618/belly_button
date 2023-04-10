//////// belly_button /////////////////
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
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
    var resultM = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(resultM).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var sampleInfo = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var result = sampleInfo.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaFilter = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var resultS = result[0];

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var metaD = metaFilter[0];
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = resultS.otu_ids;
    var otuLables = resultS.otu_labels;
    var sampleValues = resultS.sample_values;
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var washingF = parseInt(metaD.wfreq);
    
    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
    console.log(yticks);
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks, 
      x: sampleValues.slice(0,10).reverse(),
      text: otuLables.slice(0,10).reverse(),
      type: "bar", 
      orientation: "h",
      marker: {
        color: sampleValues,
        colorscale: 'Electric'
      }
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      width: 457,
      height: 400,
      title: {
        text: "Top Ten OTU's",
        disply: true,
        font: {
          size: 24,
          weight: "bold"}
      }
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout); 

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [{
      y: sampleValues, 
      x: otuIds, 
      text: otuLables,
      mode: 'markers', 
      marker: {
        color: otuIds,
        opacity: 0.5,
        size: sampleValues,
        colorscale: 'Electric',
        type: 'heatmap'
      } 
    }];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "Bacteria Cultures Per Sample", 
        display: true, 
        font: {
          size: 24, 
          weight:"bold" }
      },
      xaxis: {title: "OTU ID Numbers"},
      margin: {
        pad: 10}
      };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var washingData = [{
      value: washingF, 
      type: "indicator", 
      mode: "gauge+number",
      gauge: {
        axis: {range: [0, 10]},
        bar: { color: "black" },
        steps: [
          {range: [0,2], color: "gold"},
          {range: [2,4], color: "darkgoldenrod"},
          {range: [4,6], color: "darkmagenta"},
          {range: [6,8], color: "darkred"},
          {range: [8,10], color: "indigo"}
        ]
      },
      title: {
        display: true,
        text: "Scrubs per Week"}
      }];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var washingLayout = {
      width: 457,
      height: 400,
      title: {
        text: "Belly Button Washing Frequency", 
        display: true,
        font: {
          weight: "bold",
          size: 24}
      }
      }
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", washingData, washingLayout);
  });
}

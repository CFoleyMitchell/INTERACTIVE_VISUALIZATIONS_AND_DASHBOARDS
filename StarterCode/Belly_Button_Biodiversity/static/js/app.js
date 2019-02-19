
//************************   metadataPanel    ***************************//

function buildMetadata(sample) {
    // @TODO: Complete the following function that builds the metadata panel
    var metadataUrl = `/metadata/${sample}`;
    console.log(metadataUrl);
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(metadataUrl).then(function(metaData) {
      // Use d3 to select the panel with id of `#sample-metadata`
      var metadataPanel = d3.select("#sample-metadata");
      console.log(metadataPanel);
      // Use `.html("") to clear any existing metadata
      metadataPanel.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // (Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata)
      Object.entries(metaData).forEach(([key, value]) => {
        var row = metadataPanel.append("tr");
        row.text(`${key}: ${value}`);
        console.log(`${key}: ${value}`);
      });
    });
  }
  
  //************************   PlotData    ***************************//
  
  function buildCharts(sample) {
    // Create the plot url variable to build the charts
    var plotUrl = `/samples/${sample}`; 
      console.log(plotUrl); 
    // @TODO: Use `d3.json` to fetch the sample data for the charts
    d3.json(plotUrl).then(function(plotData) { 
      console.log(plotData);
  
  //************************   BubbleChart    ***************************//
  
    // @TODO: Build a Bubble Chart using the sample data
    var bubble_x = plotData.otu_ids;
    var bubble_y = plotData.sample_values;
    var bubble_marker_size = plotData.sample_values;
    var bubble_marker_color = plotData.otu_ids;
    var bubble_hovertext = plotData.otu_labels;
    
    var trace1 = {
        type: 'bubble',
        x: bubble_x,
        y: bubble_y,
        hovertext: bubble_hovertext,
        mode: 'markers',
        marker:{
            size: bubble_marker_size,  
            color: bubble_marker_color,
            colorscale: 'Earth'  
        }
    };
  
    var bubbleTrace = [trace1];
  
    var bubbleLayout = {
        xaxis: {title: 'OTU IDs'},
        yaxis: {title: 'Sample Values'},
        title: `Bacteria Clusters, identified as Operational Taxonomic Units (OTUs), discovered in Belly Button of SampleID: ${sample}`,
        hovermode: 'closest'
    };
  
    Plotly.newPlot('bubble',bubbleTrace, bubbleLayout);
  
  //************************   PieChart    ***************************//
  
    // //@TODO: Build a Pie Chart
    // //(HINT: You will need to use slice() to grab the top 10 sample_values,
    // //otu_ids, and labels (10 each)).
    
    // //I originally needed to sort the sample_values in descending order to get top 10 samples
    // //however this did not work because the flask routes were built to provide separate arrays
    // //for the sample_values, otu_ids, and otu_labels. So, when we sorted the sample_values in js, 
    // //the otu_ids and otu_labels did not sort with the sample_values. Therefore, the flask code 
    // //had to be updated (see line 92 of app.py), so now the data is provided in descending order 
    // //before it is jsonified. Hence, I no longer need the commented code below*, to sort 
    // //before slicing the data; I can just slice.

    // //*Code to sort sample_values in descending order
    // plotData.sample_values.sort(function (a, b) {  
    //   return b - a;   
    // });
  
  var pie_values = plotData.sample_values.slice(0, 10);
  var pie_labels = plotData.otu_ids.slice(0, 10);
  var pie_hovertext = plotData.otu_labels.slice(0, 10);
  
    var trace2 = {
        type: 'pie',
        values: pie_values,
        labels: pie_labels,
        hovertext: pie_hovertext
    };
  
    var pieTrace = [trace2];
  
    var pieLayout = {
      title: `Top 10 OTUs in Belly Button of SampleID: ${sample}`,
      hovermode: 'closest'
    };
  
    Plotly.newPlot('pie', pieTrace, pieLayout);
  
  });
  
  }
  
  //****************  Initialize Dashboard  ************************//
  
  function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  }
  
  function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
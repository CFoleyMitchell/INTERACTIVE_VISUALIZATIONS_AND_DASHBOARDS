
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
        title: `Sample Values per OTU ID for SampleID: ${sample}`,
        hovermode: 'closest'
    };
  
    Plotly.newPlot('bubble',bubbleTrace, bubbleLayout);
  
  //************************   PieChart    ***************************//
  
    // //@TODO: Build a Pie Chart
    // //(HINT: You will need to use slice() to grab the top 10 sample_values,
    // //otu_ids, and labels (10 each)).
    
    // //Need to sort descending order to get top 10 
    
    // // #1
    // //This function did not give me the same percentage results as the instruction pics.
    // plotData.sample_values.sort(function (a, b) {
    //        return d3.descending(a, b);
    //    });
  
    // // #2 
    // //This function gave me the sort I needed to get the same percentages
    // //however, the legend is different so it proves that the sort sorted the
    // //value_sample but did not bring the otu_id with the sort. - ugh
    // plotData.sample_values.sort(function (a, b) {
    //     console.log(a, b);   
    //     return b - a;   
    //    });
  
    // // #3   
    // //I think I need to do something with the indexes! Nothing rendered.
    // plotData.sort(function (a, b) {
    //  return b[2] - a[2];
    //});
  
    // // #4
    // //okay another thing that I googled...nothing rendered!
    // pieDataSort = plotData.sort(function(a, b) {
    //   return b.sample_values - a.sample_values;
    //   });
    //   console.log(pieDataSort);
     
    // var pie_values = pieDataSort.sample_values.slice(0, 10);
    // var pie_labels = pieDataSort.otu_ids.slice(0, 10);
    // var pie_hovertext = pieDataSort.otu_labels.slice(0, 10);
  
    // // #5
    // //This function did not return anything either. 
    // plotData.sort(function (a, b) {
    //     return b.sample_values - a.sample_values;   
    //     });
  
    // // Oh, do I need to create an appended array for each sampleID [otu_ids,otu_lables,sample_values] so
    // // that I can sort like 4 or 5?
    
    // #2 is the closest thing I could get to work
    plotData.sample_values.sort(function (a, b) {  
      return b - a;   
     });
  
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
      title: `Top 10 OTU_IDs for SampleID: ${sample}`,
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
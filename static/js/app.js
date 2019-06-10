function buildMetadata(sample) {
  // Using `d3.json` to fetch the metadata for a sample

  var url = `/metadata/${sample}`;
  
  d3.json(url).then(function(sampleid) {
    console.log(sampleid);
    
    // Using d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    
    // Using `.html("") to clear any existing metadata
    metadata.html("");
    
    // Using `Object.entries` to add each key and value pair to the panel
    // Using d3 to append new tags for each key-value in the metadata. 'p' used for new tags
    Object.entries(sampleid).forEach(([key, value]) => {
      metadata.append('p').text(`${key}: ${value}`);
    });
      }
    )};  

function buildCharts(sample) {
    
  
    d3.json(`/samples/${sample}`).then(function (data) {
      // console.log(sampleid);
      // console.log(sampleid.otu_ids);
      // console.log(sampleid.otu_labels);
      // console.log(sampleid.sample_values);


      //Set up identifiers/variables
      var otu_ids = data.otu_ids;
      var otu_labels = data.otu_labels;
      var sample_values = data.sample_values;

      //Setting up the Scatter chart
      var scatterdata = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        type: "scatter",
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Rainbow'
        }
      }];      

      var scatterlayout = {
        automargin: true,
        hovermode: 'closest',
        xaxis: {
          title: 'SELECTED OTU ID'},
      };

      Plotly.newPlot('bubble', scatterdata, scatterlayout);

      // Setting up the pie chart
      var piedata = [{
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10,),
        hoverinfo: 'hovertext',
        type: 'pie',
        transforms:[{
          type: "sort",
          target:"values",
          order:"ascending"
        }]
      }];

      var pielayout = {
        automargin: true,
        height: 600,
        width: 700
      }

      Plotly.newPlot('pie', piedata, pielayout); 

    });
  }
  
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
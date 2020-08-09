// Dynamically Generate Dropdown Menu Items
function init() {
    // dropdown menu is assigned to the variable selector
    var selector = d3.select("#selDataset");
    // read the data from samples.json and assign them to 'data'
    d3.json("samples.json").then((data) => {
      console.log(data);
      // dropdown menu
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      
})}

// Demographic information panel, function takes in an ID numebr as its argument
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
            
        // the contents of the panel are cleared when another ID number is chosen from the dropdown menu
        PANEL.html("");
        // the append() and text() methods are chained to append a H6 heading to the panel and print the location of the volunteer to the panel, respectively
        Object.entries(result).forEach((key)=> {
            PANEL.append("h6").text(key[0].toUpperCase() + ": " + key[1] + "\n"); 
        })
    });
  }

  // Charts function
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        // Selected ID sample
        var resultSample = data.samples.filter(sampleObj => sampleObj.id == sample.toString())[0];
        // Selecting the top 10 bacterial species (OTUs) for the selected ID:
        // selectiong top 10 otu_ids
        var ids = resultSample.otu_ids.slice(0,10).reverse();
        console.log(ids)
        //selecting top 10 sample_values
        var sampleValues =  resultSample.sample_values.slice(0,10).reverse();
        console.log(sampleValues)
        //selecting top 10 otu_labels
        var labels =  resultSample.otu_labels.slice(0,10).reverse();
        console.log(labels)
        var OTU_id = ids.map(d => "OTU " + d);

    // Bar chart    
    var trace = {
      x: sampleValues,
      y: OTU_id,
      type:"bar",
      orientation: "h",
        };
  
    var dataB=[trace];
    
    // Layout for the bar chart
    var layout = {
        title: "Top 10 OTU"
        };
    Plotly.newPlot("bar",dataB, layout);

    // Bubble chart:
    var trace2 = {
        x: resultSample.otu_ids,
        y: resultSample.sample_values,
        mode: "markers",
        marker: {
           size: resultSample.sample_values,
          color: resultSample.otu_ids
             },
        text:  resultSample.otu_labels
            };

    // Layout for the bubble chart
    var layoutB = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000};

    var dataBubble=[trace2]
    Plotly.newPlot("bubble",dataBubble, layoutB);
    });
  }

// Change event function
function optionChanged(newSample) {
         buildMetadata(newSample);
         buildCharts(newSample);
        }

init();
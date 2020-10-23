
//selects metadata in samples.json
//gets the first id number per sample
//for each key, value in sample data
// appends each pair to box

function buildMetadata(sample_id){
    d3.json("samples.json").then(function(data){
        var meta=data.metadata;
        var result=meta.filter(oneMeta=>oneMeta.id==sample_id)[0];
        console.log(result);
        var demographic_data=d3.select('#sample-metadata');
        demographic_data.html('');
        Object.entries(result).forEach(([key, value]) => {
            demographic_data.append('h6')
                            .text(`${key}: ${value}`);
        });
    });
};
function buildChart(sample_id){
    // load the data
    d3.json("samples.json").then(function(data) {

        // selects first sample per sample id

        var samples=data.samples;
        var result=samples.filter(sample=>sample.id==sample_id)[0];
      
        var barData={

            // gets each otu id per sample and adds it to the y axis
            // gets each sample value per otu id and adds it to the x axis
            // adds otu labels to y axis

            y: result.otu_ids.slice(0, 10).map(otuID=>`OTU ${otuID}`).reverse(), 
            x: result.sample_values.slice(0, 10).reverse(), 
            text: result.otu_labels.slice(0, 10).reverse(),
            type: 'bar', 
            orientation: 'h'
        };

        // adds styling to chart

        var barLayout={
            title: 'Top 10 Bacteria Cultures Found', 
            margin: {
                t: 30
            }
        };

        //creates bar chart
     

        Plotly.newPlot('bar', [barData], barLayout);


        // creates framework for bubble chart
        //size is determined by sample value

        var bubbleData={
            x: result.otu_ids, 
            y: result.sample_values, 
            text: result.otu_labels, 
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids, 
                colorScale: 'Earth'
            }
        }

        // adds styling to bubble chart

        var bubbleLayout={
            title: 'Bacteria Cultures Per Sample', 
            margin: {
                t: 30, 
            }, 
            xaxis: {
                title: 'OTU ID'
            },
            hovermode: 'closest'
        };
        Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
    });
};


// selects dropdown menu
// appends each id value selected (first)
// to dropdown menu
// builds charts for each id

var dropMenu = d3.select("#selDataset");
d3.json("samples.json").then(function(data) {
    var all_ids=data.names;
    all_ids.forEach(eachId=>{
        dropMenu.append('option')
                .text(eachId)
                // .text(`Option ${index}`)
                .property('value', eachId)
    });
    firstId=all_ids[0];
    buildChart(firstId);
    buildMetadata(firstId);
});
// if there is a new id create new bar chart and bubble chary
// along with box with id data

function optionChanged(newId){
    buildChart(newId);
    buildMetadata(newId);
};
      
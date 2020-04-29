// d3.json("samples.json").then(function(data) {
//     console.log(data);
// });

// function unpack(rows, index) {
//     return rows.map(function(row) {
//         return row[index];
//     });
// };
function buildMetadata(sample_id){
    d3.json("samples.json").then(function(data){
        var meta=data.metadata;
        var result=meta.filter(oneMeta=>oneMeta.id==sample_id)[0];
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
        // console.log(data);
        var samples=data.samples;
        var result=samples.filter(sample=>sample.id==sample_id)[0];
        // console.log(result);
        // var otu_ids=result.otu_ids;
        // var otu_labels=result.otu_labels;
        // var sample_values=result.sample_values;
        // console.log(sample_values);
        var barData={
            // y: otu_ids.slice(0, 10).map(otuID=>`OTU ${otuID}`).reverse(), 
            y: result.otu_ids.slice(0, 10).map(otuID=>`OTU ${otuID}`).reverse(), 
            x: result.sample_values.slice(0, 10).reverse(), 
            text: result.otu_labels.slice(0, 10).reverse(),
            type: 'bar', 
            orientation: 'h'
        };
        var barLayout={
            title: 'Top 10 Bacteria Cultures Found', 
            margin: {
                t: 30
            }
        };
        Plotly.newPlot('bar', [barData], barLayout);
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
// console.log(dropMenu);

function optionChanged(newId){
    buildChart(newId);
    buildMetadata(newId);
};
        // d.on("click", function () {
        //     window.event.preventDefault();
            
        //     var inputElement = d3.select("sample-metadata");
          
          
        //     var inputValue = inputElement.property("value");
            
        //     var filteredData = samples.filter(samples => samples.id===inputValue);
        //     var samples=filteredData;
        //     var filteredOTUS=samples.filter(samples=>samples.otu_ids===inputValue);
          
        //     console.log(samples);
        //     console.log(filteredData);

        //     var trace1 = {
        //         type: "bar",
        //         x: samples,
        //         y: filteredOTUS
        //       };

        //     var data = [trace1];
        //     var layout = {
        //         title: "Sample Values and OTU Ids",
        //         xaxis: { title: "OTU Ids" },
        //         yaxis: { title: "Sample Values"}
        //       };
        //     Plotly.newPlot("bar", data, layout);
        // });
        // console.log(samples);
        // do array.filter() to find just sample for the sample_id

        // set sample_values to be equal to filtered_data.sample_values

        // var barData=[x, y, type, orientation]

        // var barLayout=[title]

        // Plotly.newPlot('id_for_html_element', barData, barLayout)


// buildChart(940);
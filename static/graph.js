
// function graph(mushrooms){
      // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      // google.setOnLoadCallback(function(){drawChart(10)});

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.



      function drawChart(options, label, level, color) {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'Rover');
        data.addColumn({type: 'string', role: 'style'});
        data.addColumn('number', 'Base');
        data.addColumn({type: 'string', role: 'style'});
        
        for (var i=0; i<10;i++){
            data.addRows([[label[i], level[0][i], 'color: ' + color[0][i], level[1][i], 'color: ' + color[1][i]]]);
        }

        // Set chart options


        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

function updateCoordinateGrid(msg) {
        // status
        $("#status_value").html("<span>" + msg.solution_status + "</span>");
        $("#mode_value").html("<span>" + msg.positioning_mode + "</span>");

        // coordinates
        // fix length of the strings

        var lon_value = msg.lon.substring(0, 9) + Array(9 - msg.lon.substring(0, 9).length + 1).join(" ");
        var lat_value = msg.lat.substring(0, 9) + Array(9 - msg.lat.substring(0, 9).length + 1).join(" ");

        var height_value = msg.height.substring(0, 9) + Array(9 - msg.height.substring(0, 9).length + 1 + 2).join(" ");

        $("#lon_value").html("<span style='white-space:pre;'>" + lon_value + "</span>");
        $("#lat_value").html("<span style='white-space:pre;'>" + lat_value + "</span>");
        $("#height_value").html("<span style='white-space:pre;'>" + height_value + "  " + "</span>");

        // TODO: obs values: heartbeat
}

function updateSatelliteGraphRover(msg) {

    // msg object contains satellite data for rover in {"name0": "level0", "name1": "level1"} format

    // we want to display the top 10 results
    // var number_of_satellites = 10;

    // // graph has a list of datasets. rover sat values are in the first one
    // var rover_dataset_number = 1;

    // // first, we convert the msg object into a list of satellites to make it sortable

    // var new_sat_values = [];

    // for (var k in msg) {
    //     new_sat_values.push({sat:k, level:msg[k]});
    // }

    // // sort the sat levels by ascension
    // new_sat_values.sort(function(a, b) {
    //     var diff = a.level - b.level;

    //     if (Math.abs(diff) < 3) {
    //         diff = 0;
    //     }

    //     return diff
    // });

    // // next step is to cycle through top 10 values if they exist
    // // and extract info about them: level, name, and define their color depending on the level

    // var new_sat_values_length = new_sat_values.length;
    // var new_sat_levels = [];
    // var new_sat_labels = [];
    // var new_sat_fillcolors = [];

    // for(var i = new_sat_values_length - number_of_satellites; i < new_sat_values_length; i++) {
    //     // check if we actually have enough satellites to plot:
    //     if (i <  0) {
    //         // we have less than number_of_satellites to plot
    //         // so we fill the first bars of the graph with zeroes and stuff
    //         new_sat_levels.push(0);
    //         new_sat_labels.push("");
    //         new_sat_fillcolors.push("rgba(0, 0, 0, 0.9)");
    //     } else {
    //         // we have gotten to useful data!! let's add it to the the array too

    //         // for some reason I sometimes get undefined here. So plot zero just to be safe
    //         var current_level = parseInt(new_sat_values[i].level) || 0;
    //         var current_fillcolor;

    //         // determine the fill color depending on the sat level
    //         switch(true) {
    //             case (current_level < 30):
    //                 current_fillcolor = "rgba(255, 0, 0, 0.7)"; // Red
    //                 break;
    //             case (current_level >= 30 && current_level <= 45):
    //                 current_fillcolor = "rgba(255, 255, 0, 0.7)"; // Yellow
    //                 break;
    //             case (current_level >= 45):
    //                 current_fillcolor = "rgba(0, 255, 0, 0.7)"; // Green
    //                 break;
    //         }

    //         new_sat_levels.push(current_level);
    //         new_sat_labels.push(new_sat_values[i].sat);
    //         new_sat_fillcolors.push(current_fillcolor);
    //     }
    // }

    // // now, that we have a 3 arrays of names, levels and colors we add them to the graph data structure


    // var options = {
    //     legend: 'none',
    //     'height':300,
    //     animation:{
    //         "startup": true,
    //         duration: 1000,
    //         easing: 'out',
    //     },
    //     vAxis: {minValue:0, maxValue:50}
    // };

    // level[1] = new_sat_levels;
    // color[1] = new_sat_fillcolors;

    // drawChart(options, new_sat_labels, level, color);

}

function updateSatelliteGraphBase(msg) {
    // this function also updates the sat levels chart, but it handles base data
    // on the contrary from the updateSatelliteGraphRover(msg) this function adds base data to the 
    // corresponding rover satellites. In other words, we have a comparison of how the rover
    // and the base see the top 10 rover's satellies

//     var base_dataset_number = 0;
//     var current_level = 0;
//     var current_fillcolor;

//     // cycle through the graphs's labels and extract base levels for them
//     satellite_graph.data.labels.forEach(function(label, label_index) {
//         if (label in msg) {
//             // get the sat level as an integer
//             current_level = parseInt(msg[label]);

//             // determine the fill color depending on the sat level
//             switch(true) {
//                 case (current_level < 30):
//                     current_fillcolor = "rgba(255, 0, 0, 0.1)"; // Red
//                     break;
//                 case (current_level >= 30 && current_level <= 45):
//                     current_fillcolor = "rgba(255, 255, 0, 0.1)"; // Yellow
//                     break;
//                 case (current_level >= 45):
//                     current_fillcolor = "rgba(0, 255, 0, 0.1)"; // Green
//                     break;
//             }

//             satellite_graph.data.datasets[base_dataset_number].data[label_index] = current_level;
//             satellite_graph.data.datasets[base_dataset_number].metaData[label_index].custom = {
//                 backgroundColor: "rgba(186, 186, 186, 0.8)"
//             }
//         } else {
//             // if we don't the same satellite in the base
//             satellite_graph.data.datasets[base_dataset_number].data[label_index] = 0;
//         }
//     });

//     // we update the graph here because we want to update the rover info first
//     // then update base info depending on the rover's new values
//     satellite_graph.update();
}

function cleanStatus(mode, status) {

//     console.log("Got signal to clean the graph")

//     mode = typeof mode !== "undefined" ? mode : "rtklib stopped";
//     status = typeof status !== "undefined" ? status : "-";

//     var empty_string_list = [];
//     for (var i = 0; i < 10; i++) {
//         empty_string_list[i] = "";
//     }

//     $.each(satellite_graph.data.datasets, function(i, dataset) {
//         dataset.data = empty_string_list;
//     });

//     satellite_graph.data.labels = empty_string_list;
//     satellite_graph.update();

//     var msg = {
//         "lat" : "0",
//         "lon" : "0",
//         "height": "0",
//         "solution_status": status,
//         "positioning_mode": mode
//     };

//     updateCoordinateGrid(msg);
}

function rr(){
    var options = {
        legend: 'none',
        'height':300,
        animation:{
            // "startup": true,
            duration: 1000,
            easing: 'out',
        },
        vAxis: {minValue:0, maxValue:50}
    };
    

    label = ['G10', 'G02', 'G03', 'G40', 'G05', 'G60', 'G70', 'G80', 'G90', 'G1'];
    level = [[10,30,33,43,43,21,43,12,43,36], [40,38,42,23,32,35,45,46,47,47]];
    color = [['blue', 'red', 'green', 'blue', 'red', 'green','blue', 'red', 'green','Yellow'], ['red','green','blue','red','green','blue','red','green','blue','green']];
    drawChart(options, label, level, color);
}

function createGraph(){
    var options = {
        legend: 'none',
        'height':300,
        animation:{
            "startup": true,
            duration: 1000,
            easing: 'out',
        },
        vAxis: {minValue:0, maxValue:50}
    };
    label = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'];
    level = [[40,38,42,48,43,50,21,23,43,56], [10,30,33,43,23,43,23,43,45,49]];
    color = [['red','green','blue', 'red','green','blue', 'red','green','blue', 'blue'], ['blue', 'red', 'green', 'blue', 'red', 'green', 'blue', 'red', 'green', 'red']];
    drawChart(options, label, level, color);
}
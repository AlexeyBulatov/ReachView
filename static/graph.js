
function Chart() {
    this.chartdata = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
    this.chartdata1 = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
    this.labeldata = ['', '', '', '', '', '', '', '', '', ''];
    // height = 0;
    this.roverBars = '';
    this.baseBars = '';
    this.labels = '';

    this.create = function(){
        var height = 55*5;
        var margin = {top: 30, right: 10, bottom: 30, left: 40};
        //  the size of the overall svg element
        var width = $("#bar-chart").width() - margin.left - margin.right,
            barWidth = width*0.08,
            barOffset = width*0.02;

        var svg = d3.select('#bar-chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .style('background', 'white');

        var yScale = d3.scale.linear()
        .domain([0, 55])
        .range([0, height])
     
        var xScale = d3.scale.ordinal()
            .rangeBands([0, width])

        var verticalGuideScale = d3.scale.linear()
            .domain([0, 55])
            .range([height, 0])
         
        var vAxis = d3.svg.axis()
            .scale(verticalGuideScale)
            .orient('left')
            .ticks(10)
            .tickSize(-width, 0, 0)
         
        var verticalGuide = d3.select('svg').append('g')
        vAxis(verticalGuide)
        verticalGuide.attr('transform', 'translate(' + 30 + ', ' + margin.top + ')')
        verticalGuide.selectAll('path')
            .style({fill: 'none', stroke: "black"})
        verticalGuide.selectAll('line')
            .style({stroke: "rgba(0,0,0,0.2)"})
         

        var hAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
         
        var horizontalGuide = d3.select('svg').append('g')
        hAxis(horizontalGuide)
        horizontalGuide.attr('transform', 'translate(' + 30 + ', ' + (height + margin.top) + ')')
        horizontalGuide.selectAll('path')
            .style({fill: 'none', stroke: "black"})
        horizontalGuide.selectAll('line')
            .style({stroke: "black"});

        this.roverBars = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(this.chartdata)
            .enter().append('rect')
            .style("fill", function(data) { return data.color; })
            .style({stroke: "black"})
            .attr('width', barWidth/2)
            .attr('height', function (data) {
                return 5*data.value;
            })
            .attr('x', function (data, i) {
                return i * (barWidth + barOffset);
            })
            .attr('y', function (data) {
                return (height - 5*data.value);
                // return (height - 5*data.value);
            });

        this.baseBars = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .selectAll('rect').data(this.chartdata1)
            .enter().append('rect')
            .style("fill", function(data) { return data.color; })
            .style({stroke: "black"})
            .attr('width', barWidth/2)
            .attr('height', function (data) {
                return 5*data.value;
            })
            .attr('x', function (data, i) {
                return i * (barWidth + barOffset) + barWidth/2;
            })
            .attr('y', function (data) {
                return (55*5 - 5*data.value);
                // return (height - 5*data.value);
            });

        this.labels = svg.append("g")
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            .attr("class", "labels")
            .selectAll("text")
            .data(this.labeldata)
            .enter()
            .append("text")
            .attr("dx", function(d, i) {
                return (i * (barWidth + barOffset)) + barWidth/2-14
            })
            .attr("dy", height + 20)
            .text(function(d) {
                return d;
            });

        // $(window).resize(function() {
        //     var width = $("#bar-chart").width() - margin.left - margin.right;
            
        //     var barWidth = width*0.08;
        //     var barOffset = width*0.02;
        //     svg.attr('width', width + margin.left + margin.right)
            
        //     this.roverBars.attr("width", barWidth/2)
        //     .attr('x', function (data, i) {
        //         return i * (barWidth + barOffset);
        //     })
        //     this.baseBars.attr("width", barWidth/2)
        //     .attr('x', function (data, i) {
        //         return i * (barWidth + barOffset) + barWidth/2;
        //     })
        //     this.labels.attr("dx", function(d, i) {
        //         return (i * (barWidth + barOffset)) + barWidth/2-14;
        //     })
        //     vAxis.tickSize(-width, 0, 0)
        //     vAxis(verticalGuide)

        //     xScale.rangeBands([0, width])
        //     hAxis.scale(xScale)
        //     hAxis(horizontalGuide)
        // });
    }

    this.roverUpdate = function(msg){
        // msg object contains satellite data for rover in {"name0": "level0", "name1": "level1"} format

        // we want to display the top 10 results
        var number_of_satellites = 10;

        // graph has a list of datasets. rover sat values are in the first one
        var rover_dataset_number = 1;

        // first, we convert the msg object into a list of satellites to make it sortable

        var new_sat_values = [];

        for (var k in msg) {
            new_sat_values.push({sat:k, level:msg[k]});
        }

        // sort the sat levels by ascension
        new_sat_values.sort(function(a, b) {
            var diff = a.level - b.level;

            if (Math.abs(diff) < 3) {
                diff = 0;
            }

            return diff
        });

        // next step is to cycle through top 10 values if they exist
        // and extract info about them: level, name, and define their color depending on the level

        var new_sat_values_length = new_sat_values.length;
        var new_sat_levels = [];
        var new_sat_labels = [];
        var new_sat_fillcolors = [];

        for(var i = new_sat_values_length - number_of_satellites; i < new_sat_values_length; i++) {
            // check if we actually have enough satellites to plot:
            if (i <  0) {
                // we have less than number_of_satellites to plot
                // so we fill the first bars of the graph with zeroes and stuff
                new_sat_levels.push(0);
                new_sat_labels.push("");
                new_sat_fillcolors.push("rgba(0, 0, 0, 0.9)");
            } else {
                // we have gotten to useful data!! let's add it to the the array too

                // for some reason I sometimes get undefined here. So plot zero just to be safe
                var current_level = parseInt(new_sat_values[i].level) || 0;
                var current_fillcolor;

                // determine the fill color depending on the sat level
                switch(true) {
                    case (current_level < 30):
                        current_fillcolor = "#FF766C"; // Red
                        break;
                    case (current_level >= 30 && current_level <= 45):
                        current_fillcolor = "#FFEA5B"; // Yellow
                        break;
                    case (current_level >= 45):
                        current_fillcolor = "#44D62C"; // Green
                        break;
                }

                new_sat_levels.push(current_level);
                new_sat_labels.push(new_sat_values[i].sat);
                new_sat_fillcolors.push(current_fillcolor);
            }
        }

        // this.chartdata = [{'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}];
        // this.labeldata = ['', '', '', '', '', '', '', '', '', ''];

        for (var i = 0; i < new_sat_levels.length; i++) {
            this.chartdata[i]['value'] = new_sat_levels[i];
            this.chartdata[i]['color'] = new_sat_fillcolors[i];
            this.labeldata[i] = new_sat_labels[i];
        };

        this.roverBars.data(this.chartdata)
        .transition()    
        .attr('height', function (data) {
            return 5*data.value;
        })
        .attr('y', function (data) {
            return (55*5 - 5*data.value);
        })
        .style("fill", function(data) { return data.color; })
        .duration(300);

        this.labels.data(this.labeldata)
            .text(function(d) {
                return d;
            });
    }




    this.baseUpdate = function(msg){
        var base_dataset_number = 0;
        var current_level = 0;
        var current_fillcolor;
        var new_sat_levels = [];
        // var new_sat_labels = [];
        var new_sat_fillcolors = [];
        // this.chartdata1 = [{'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}, {'value':'', 'color':''}];
        // console.log(this.labeldata);

        // cycle through the graphs's labels and extract base levels for them
        this.labeldata.forEach(function(label, label_index) {
            if (label in msg) {
                // get the sat level as an integer
                current_level = parseInt(msg[label]);

                // determine the fill color depending on the sat level
                // switch(true) {
                //     case (current_level < 30):
                //         current_fillcolor = "rgba(255, 0, 0, 0.1)"; // Red
                //         break;
                //     case (current_level >= 30 && current_level <= 45):
                //         current_fillcolor = "rgba(255, 255, 0, 0.1)"; // Yellow
                //         break;
                //     case (current_level >= 45):
                //         current_fillcolor = "rgba(0, 255, 0, 0.1)"; // Green
                //         break;
                // }

                new_sat_levels.push(current_level);
                new_sat_fillcolors.push("#d9d9d9");

            } else {
                // if we don't the same satellite in the base
                new_sat_levels.push(0);
                new_sat_fillcolors.push("#d9d9d9");
            }
            

        });
        for (var i = 0; i < new_sat_levels.length; i++) {
            this.chartdata1[i]['value'] = new_sat_levels[i];
            this.chartdata1[i]['color'] = new_sat_fillcolors[i];
        };

        this.baseBars.data(this.chartdata1)
        .transition()    
        .attr('height', function (data) {
            return 5*data.value;
        })
        .attr('y', function (data) {
            return (55*5 - 5*data.value);
        })
        .style("fill", function(data) { return data.color; })
        .duration(300);
    }









    this.cleanStatus = function(mode, status) {
        this.chartdata = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
        this.chartdata1 = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
        this.labeldata = ['', '', '', '', '', '', '', '', '', ''];

        console.log("Got signal to clean the graph")

        mode = typeof mode !== "undefined" ? mode : "rtklib stopped";
        status = typeof status !== "undefined" ? status : "-";

        var empty_string_list = [];
        for (var i = 0; i < 10; i++) {
            empty_string_list[i] = "";
        }

        // $.each(satellite_graph.data.datasets, function(i, dataset) {
        //     dataset.data = empty_string_list;
        // });

        // satellite_graph.data.labels = empty_string_list;
        // satellite_graph.update();

        this.roverBars.data(this.chartdata)
        .transition()    
        .attr('height', function (data) {
            return 5*data.value;
        })
        .attr('y', function (data) {
            return (55*5 - 5*data.value);
        })
        .style("fill", function(data) { return data.color; })
        .duration(300);

        this.baseBars.data(this.chartdata)
        .transition()    
        .attr('height', function (data) {
            return 5*data.value;
        })
        .attr('y', function (data) {
            return (55*5 - 5*data.value);
        })
        .style("fill", function(data) { return data.color; })
        .duration(300);

        this.labels.data(this.labeldata)
            .text(function(d) {
                return d;
            });
    }

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

function updateSatelliteGraphBase(msg) {
    // this function also updates the sat levels chart, but it handles base data
    // on the contrary from the updateSatelliteGraphRover(msg) this function adds base data to the 
    // corresponding rover satellites. In other words, we have a comparison of how the rover
    // and the base see the top 10 rover's satellies





    // we update the graph here because we want to update the rover info first
    // then update base info depending on the rover's new values
    // satellite_graph.update();
}

function updateBase(baseBars, height, chartdata){

    baseBars.data(chartdata)
    .transition()    
    .attr('height', function (data) {
        return 5*data.value;
    })
    .attr('y', function (data) {
        return (height - 5*data.value);
    })
    .style("fill", function(data) { return data.color; })
    .duration(300);
}

function cleanStatus(mode,status){
    // console.log(1);
            // $.each(satellite_graph.data.datasets, function(i, dataset) {
        //     dataset.data = empty_string_list;
        // });

        // satellite_graph.data.labels = empty_string_list;
        // satellite_graph.update();

        // this.roverBars.data(this.chartdata)
        // .transition()    
        // .attr('height', function (data) {
        //     return 5*data.value;
        // })
        // .attr('y', function (data) {
        //     return (55*5 - 5*data.value);
        // })
        // .style("fill", function(data) { return data.color; })
        // .duration(300);

        // this.baseBars.data(this.chartdata)
        // .transition()    
        // .attr('height', function (data) {
        //     return 5*data.value;
        // })
        // .attr('y', function (data) {
        //     return (55*5 - 5*data.value);
        // })
        // .style("fill", function(data) { return data.color; })
        // .duration(300);

        // this.labels.data(this.labeldata)
        //     .text(function(d) {
        //         return d;
        //     });
    // }
}
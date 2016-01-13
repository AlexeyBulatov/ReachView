function Chart() {

    this.chartdata = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
    this.chartdata1 = [{'value':'', 'color':'rgba(255,0,0,0.5)'}, {'value':'', 'color':'rgba(255,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}, {'value':'', 'color':'rgba(0,255,0,0.5)'}];
    this.labeldata = ['', '', '', '', '', '', '', '', '', ''];
    
    this.lineData = [{x: '', y: ''}];
    this.height = parseInt(55*5);
    this.roverBars = '';
    this.baseBars = '';
    this.labels = '';
    this.svg = '';
    this.svg1 = '';
    this.vAxis = '';
    this.verticalGuide = '';
    this.xScale = '';
    this.hAxis = '';
    this.horizontalGuide = '';
    this.vAxis1 = '';
    this.verticalGuide1 = '';
    this.xScale1 = '';
    this.hAxis1 = '';
    this.horizontalGuide = '';

    this.create = function(){

        var grid_style = {
            borderRight: "1x solid #ddd",
            // borderTop: "1px solid #ddd",
            textAlign: "left", 
            borderCollapse: 'collapse',
            fontSize: '15px'
        };

        $("#status_block, #mode_block, #satellites_valid_block, #age_of_differential_block").css({borderRight: '1px solid #ddd', borderBottom: '1px solid #ddd'});
        $("#lat_block, #lon_block, #height_block, #obs_base_block, #obs_rover_block, #satellites_base_block, #satellites_rover_block").css(grid_style);
        $('.ui-grid-b .ui-bar, .ui-grid-c .ui-bar').css({borderBottom: '1px solid #ddd',borderRight: '1px solid #ddd'});

        // Default values for the info boxes

        $("#mode_value").text("no link");
        $("#status_value").text("no link");
        $("#lon_value").text("0");
        $("#lat_value").text("0");
        $("#height_value").html("0");

        var height = 55*5;
        var margin = {top: 30, right: 10, bottom: 30, left: 40};
        //  the size of the overall svg element
        var width = $("#bar-chart").width() - margin.left - margin.right,
            barWidth = width*0.08,
            barOffset = width*0.02;

        this.svg = d3.select('#bar-chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .style('background', 'white');

        var yScale = d3.scale.linear()
        .domain([0, 55])
        .range([0, height])
     
        this.xScale = d3.scale.ordinal()
            .rangeBands([0, width])

        var verticalGuideScale = d3.scale.linear()
            .domain([0, 55])
            .range([height, 0])
         
        this.vAxis = d3.svg.axis()
            .scale(verticalGuideScale)
            .orient('left')
            .ticks(10)
            .tickSize(-width, 0, 0)
         
        this.verticalGuide = d3.select('svg').append('g')
        this.vAxis(this.verticalGuide)
        this.verticalGuide.attr('transform', 'translate(' + 30 + ', ' + margin.top + ')')
        this.verticalGuide.selectAll('path')
            .style({fill: 'none', stroke: "black"})
        this.verticalGuide.selectAll('line')
            .style({stroke: "rgba(0,0,0,0.2)"})

        this.hAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom')
         
        this.horizontalGuide = d3.select('svg').append('g')
        this.hAxis(this.horizontalGuide)
        this.horizontalGuide.attr('transform', 'translate(' + 30 + ', ' + (height + margin.top) + ')')
        this.horizontalGuide.selectAll('path')
            .style({fill: 'none', stroke: "black"})
        this.horizontalGuide.selectAll('line')
            .style({stroke: "black"});

        this.roverBars = this.svg.append('g')
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
                return (55*5 - 5*data.value);
            });

        this.baseBars = this.svg.append('g')
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
            });

        this.labels = this.svg.append("g")
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
            })
            .style("font-size","13px");
    }

    this.scatter = function(){

       this.lineData = [{
          x: 0,
          y: 11
        }, {
          x: 50,
          y: 20
        }, {
          x: 100,
          y: 20
        }, {
          x: 140,
          y: 44
        }, {
          x: 200,
          y: 30
        }, {
          x: 250,
          y: 40
        }];
        // Default values for the info boxes

        var height = 55*5;
        var margin = {top: 30, right: 10, bottom: 30, left: 40};
        //  the size of the overall svg element
        var width = $("#scatter-chart").width() - margin.left - margin.right,
            barWidth = width*0.08,
            barOffset = width*0.02;

        this.svg = d3.select('#scatter-chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            // .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
            .style('background', 'white');

        var yScale = d3.scale.linear()
        .domain([0, 55])
        .range([0, height])
     
        this.xScale = d3.scale.linear()
            // .domain([0, 55])
            .range([0, width])

        var verticalGuideScale = d3.scale.linear()
            // .domain([0, 55])
            .range([height, 0])
         
        this.vAxis = d3.svg.axis()
            .scale(verticalGuideScale)
            .orient('left')
            .ticks(10)
            .tickSize(-width, 0, 0)
         
        this.verticalGuide = d3.select('#scatter-chart svg').append('g')
        this.vAxis(this.verticalGuide)
        this.verticalGuide.attr('transform', 'translate(' + 30 + ', ' + margin.top + ')')
        this.verticalGuide.selectAll('line')
            .style({stroke: "rgba(0,0,0,0.2)"})
		this.verticalGuide.selectAll('text')
            .style({'display': "none"})
         

        this.hAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom')
            .ticks(20)
            .tickSize(-height, 0, 0)

        var x = d3.time.scale().domain([0, width]).range([0, width]);
        var y = d3.scale.linear().domain([0, 55]).range([55, 0]);

        this.horizontalGuide = d3.select('#scatter-chart svg').append('g')
        this.hAxis(this.horizontalGuide)
        this.horizontalGuide.attr('transform', 'translate(' + 30 + ', ' + (height + margin.top) + ')')
        this.horizontalGuide.selectAll('line')
            .style({stroke: "rgba(0,0,0,0.2)"})
        this.horizontalGuide.selectAll('text')
            .style({'display': "none"})

        var lineFunc = d3.svg.line()
            .x(function(d) { return x(d.x + 30); })
            .y(function(d) { return 5*y(d.y - 6); })
            .interpolate('linear');
		
		// var scale = 55/(d3.max(this.lineData, function(d){return d.y}) - d3.min(this.lineData, function(d){return d.y}));
		var scale = '1';
		var xShear = width-d3.max(this.lineData, function(d){return d.x})+d3.min(this.lineData, function(d){return d.x}) + (d3.max(this.lineData, function(d){return d.x})+d3.min(this.lineData, function(d){return d.x}))*(1 - scale)*3/2;
		// var yShear = -height + d3.max(this.lineData, function(d){return 5*d.y}) + d3.min(this.lineData, function(d){return 5*d.y}) - (d3.max(this.lineData, function(d){return 5*d.y}) + d3.min(this.lineData, function(d){return 5*d.y}))*(1 - scale)*5;
		var yShear = -height + (d3.max(this.lineData, function(d){return 5*d.y}) + d3.min(this.lineData, function(d){return 5*d.y}));

        this.svg.selectAll("dot")
            .data(this.lineData)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.x + 30); })
            .attr("cy", function(d) { return 5*y(d.y - 6); })
            .attr('transform', 'translate('+ xShear/2 +','+ yShear/2 +')scale(' + scale + ')')


       this.svg.append('path')
          .attr('d', lineFunc(this.lineData))
          .attr('stroke', 'blue')
          .attr('stroke-width', 1)
          .attr('fill', 'none')
          .attr('transform', 'translate('+ xShear/2 +','+ yShear/2 +')scale(' + scale + ')')
    }

    this.resize = function(){

        var margin = {top: 30, right: 10, bottom: 30, left: 40};
        var width = $("#bar-chart").width() - margin.left - margin.right;
        
        var barWidth = width*0.08;
        var barOffset = width*0.02;
        this.svg.attr('width', width + margin.left + margin.right)
        
        this.roverBars.attr("width", barWidth/2)
        .attr('x', function (data, i) {
            return i * (barWidth + barOffset);
        })
        this.baseBars.attr("width", barWidth/2)
        .attr('x', function (data, i) {
            return i * (barWidth + barOffset) + barWidth/2;
        })
        this.labels.attr("dx", function(d, i) {
            return (i * (barWidth + barOffset)) + barWidth/2-14;
        })
        this.vAxis.tickSize(-width, 0, 0)
        this.vAxis(this.verticalGuide)

        this.xScale.rangeBands([0, width])
        this.hAxis.scale(this.xScale)
        this.hAxis(this.horizontalGuide)
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

        // cycle through the graphs's labels and extract base levels for them
        this.labeldata.forEach(function(label, label_index) {
            if (label in msg) {
                // get the sat level as an integer
                current_level = parseInt(msg[label]);

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

    this.scatterUpdate = function(msg){
        this.lineData = [{
          x: 100,
          y: msg.lat
        }];

        var height = 55*5;
        var margin = {top: 30, right: 10, bottom: 30, left: 40};
        //  the size of the overall svg element
        var width = $("#scatter-chart").width() - margin.left - margin.right;
        var x = d3.time.scale().domain([0, 50]).range([0, 50]);
        var y = d3.scale.linear().domain([0, 55]).range([55, 0]);

        // this.svg.selectAll("dot")
        //     .data(this.lineData)
        //     .enter().append("circle")
        //     .transition()
        //     .attr("r", 1.5)
        //     .attr("cx", function(d) { return x(d.x + 30); })
        //     .attr("cy", function(d) { return 5*y(d.y - 6); })
        //     .duration(300);

        // var lineFunc = d3.svg.line()
        //     .x(function(d) { return x(d.x + 30); })
        //     .y(function(d) { return 5*y(d.y - 6); })
        //     .interpolate('linear');

       // this.svg.append('path')
       //      .transition()
       //      .attr('d', lineFunc(this.lineData))
       //      .attr('stroke', 'blue')
       //      .attr('stroke-width', 1)
       //      .attr('fill', 'none')
       //      .duration(300);

        updateCoordinateGrid(msg);
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

        var msg = {
            "lat" : "0",
            "lon" : "0",
            "height": "0",
            "solution_status": status,
            "positioning_mode": mode, 
            "satellites_valid": "0", 
            "age_of_differential": "0", 
            "obs_base": "0", 
            "obs_rover": "0", 
            "satellites_base": "0", 
            "satellites_rover": "0", 
        };

        updateCoordinateGrid(msg);
    }

}

function updateCoordinateGrid(msg) {
        // status
        $("#status_value").html("<span>" + msg.solution_status + "</span>");
        $("#mode_value").html("<span>" + msg.positioning_mode + "</span>");
        $("#satellites_valid_value").html("<span>" + msg.satellites_valid + "</span>");
        $("#age_of_differential_value").html("<span>" + msg.age_of_differential + "</span>");
        $("#obs_base_value").html("<span>" + msg.obs_base + "</span>");
        $("#obs_rover_value").html("<span>" + msg.obs_rover + "</span>");
        $("#satellites_base_value").html("<span>" + msg.satellites_base + "</span>");
        $("#satellites_rover_value").html("<span>" + msg.satellites_rover + "</span>");

        // coordinates
        // fix length of the strings

        var lon_value = msg.lon.substring(0, 11) + Array(11 - msg.lon.substring(0, 11).length + 1).join(" ");
        var lat_value = msg.lat.substring(0, 11) + Array(11 - msg.lat.substring(0, 11).length + 1).join(" ");

        var height_value = msg.height.substring(0, 11) + Array(11 - msg.height.substring(0, 11).length + 1 + 2).join(" ");

        $("#lon_value").html("<span style='white-space:pre;'>" + lon_value + "</span>");
        $("#lat_value").html("<span style='white-space:pre;'>" + lat_value + "</span>");
        $("#height_value").html("<span style='white-space:pre;'>" + height_value + "  " + "</span>");
        // $('#click_copy').attr('data-clipboard-text', lat_value + ' ' + lon_value + ' ' + height_value);
        console.log(msg);

        // TODO: obs values: heartbeat
}
